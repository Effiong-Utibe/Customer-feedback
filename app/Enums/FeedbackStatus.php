<?php

namespace App\Enums;

enum FeedbackStatus: string
{
    case Submitted = 'SUBMITTED';
    case UnderReview = 'UNDER_REVIEW';
    case Assigned = 'ASSIGNED';
    case InProgress = 'IN_PROGRESS';
    case Resolved = 'RESOLVED';
    case Closed = 'CLOSED';
}
