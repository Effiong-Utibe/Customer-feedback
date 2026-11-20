<?php

namespace App\Enums;

enum SurveyStatus: string
{
    case Draft = 'DRAFT';
    case Scheduled = 'SCHEDULED';
    case Active = 'ACTIVE';
    case Closed = 'CLOSED';
    case Archived = 'ARCHIVED';
}
