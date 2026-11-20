<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class)
    ->beforeEach(function (): void {
        $this->withoutVite();
    })
    ->in('Feature');
