<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateStaffRequest;
use App\Http\Requests\UpdateAccountStatusRequest;
use App\Http\Requests\UpdateUserRoleRequest;
use App\Models\ActivityLog;
use App\Models\CustomerProfile;
use App\Models\StaffProfile;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminUserController extends Controller
{
    public function customers(Request $request): Response
    {
        abort_unless($request->user()->can('customers.view'), 403);

        return $this->list($request, 'CUSTOMER', 'admin/customers/index');
    }

    public function staff(Request $request): Response
    {
        abort_unless($request->user()->can('staff.view'), 403);

        return $this->list($request, 'STAFF', 'admin/staff/index');
    }

    public function users(Request $request): Response
    {
        abort_unless($request->user()->can('users.view'), 403);

        return $this->list($request, null, 'admin/users/index');
    }

    public function createStaff(Request $request): Response
    {
        abort_unless($request->user()->can('staff.create'), 403);

        return Inertia::render('admin/staff/create');
    }

    public function storeStaff(CreateStaffRequest $request, ActivityLogger $logger): RedirectResponse
    {
        $data = $request->validated();
        $user = DB::transaction(function () use ($data, $logger): User {
            $user = User::create([
                'name' => $data['name'],
                'email' => mb_strtolower($data['email']),
                'password' => Str::random(64),
                'is_active' => true,
            ]);
            $user->assignRole(Role::findOrCreate('STAFF', 'web'));
            StaffProfile::create([
                'user_id' => $user->id,
                'staff_number' => $data['staff_number'],
                'job_title' => $data['job_title'] ?? null,
                'department' => $data['department'] ?? null,
            ]);
            $logger->record('staff.created', $user, ['staff_number' => $data['staff_number']]);

            return $user;
        });
        Password::sendResetLink(['email' => $user->email]);

        return redirect()->route('admin.users.show', $user)->with('success', 'Staff account created. The user can set a password from the reset link.');
    }

    public function show(Request $request, User $user): Response
    {
        abort_unless($request->user()->can('users.view'), 403);
        $user->load('roles', 'customerProfile', 'staffProfile');

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'feedback' => $user->hasRole('CUSTOMER')
                ? $user->submittedFeedback()->with('category:id,name')->latest()->limit(20)->get()
                : $user->assignedFeedback()->with('category:id,name')->latest()->limit(20)->get(),
            'surveyResponses' => $user->surveyResponses()->with('survey:id,title')->latest('submitted_at')->limit(20)->get(),
            'activity' => ActivityLog::where('actor_id', $user->id)->latest()->limit(20)->get(),
        ]);
    }

    public function updateStatus(UpdateAccountStatusRequest $request, User $user, ActivityLogger $logger): RedirectResponse
    {
        $active = (bool) $request->validated('is_active');
        abort_if($request->user()->is($user) && ! $active, 422, 'You cannot deactivate your own account.');
        if (! $active && $user->hasRole('ADMIN')) {
            abort_if(User::role('ADMIN')->where('is_active', true)->count() <= 1, 422, 'At least one active administrator is required.');
        }

        $previous = $user->is_active;
        $user->update(['is_active' => $active]);
        $logger->record($active ? 'user.activated' : 'user.deactivated', $user, ['from' => $previous, 'to' => $active]);

        return back()->with('success', $active ? 'Account activated.' : 'Account deactivated.');
    }

    public function updateRole(UpdateUserRoleRequest $request, User $user, ActivityLogger $logger): RedirectResponse
    {
        abort_if($request->user()->is($user), 422, 'You cannot change your own role.');
        $newRole = $request->validated('role');
        if ($user->hasRole('ADMIN') && $newRole !== 'ADMIN') {
            abort_if(User::role('ADMIN')->where('is_active', true)->count() <= 1, 422, 'At least one active administrator is required.');
        }

        $previous = $user->getRoleNames()->all();
        $user->syncRoles([Role::findOrCreate($newRole, 'web')]);
        if ($newRole === 'CUSTOMER') {
            CustomerProfile::firstOrCreate(['user_id' => $user->id]);
        }
        if ($newRole === 'STAFF') {
            StaffProfile::firstOrCreate(['user_id' => $user->id], ['staff_number' => 'UIV-'.$user->id]);
        }
        $logger->record('user.role_changed', $user, ['from' => $previous, 'to' => $newRole]);

        return back()->with('success', 'User role updated.');
    }

    private function list(Request $request, ?string $fixedRole, string $page): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'active' => ['nullable', 'in:0,1'],
            'role' => ['nullable', 'in:ADMIN,STAFF,CUSTOMER'],
        ]);
        $role = $fixedRole ?? ($filters['role'] ?? null);
        $users = User::query()->with(['roles', 'staffProfile', 'customerProfile'])
            ->when($role, fn ($query, $role) => $query->role($role))
            ->when(isset($filters['active']), fn ($query) => $query->where('is_active', (bool) $filters['active']))
            ->when($filters['q'] ?? null, fn ($query, $search) => $query->where(fn ($query) => $query
                ->whereRaw('LOWER(name) LIKE ?', ['%'.mb_strtolower($search).'%'])
                ->orWhereRaw('LOWER(email) LIKE ?', ['%'.mb_strtolower($search).'%'])))
            ->orderBy('name')->paginate(15)->withQueryString();

        return Inertia::render($page, ['users' => $users, 'filters' => $filters, 'roleFilter' => $role]);
    }
}
