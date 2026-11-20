<?php

namespace App\Enums;

enum SurveyQuestionType: string
{
    case ShortText = 'SHORT_TEXT';
    case LongText = 'LONG_TEXT';
    case SingleChoice = 'SINGLE_CHOICE';
    case MultipleChoice = 'MULTIPLE_CHOICE';
    case Dropdown = 'DROPDOWN';
    case Rating = 'RATING';
    case LinearScale = 'LINEAR_SCALE';
    case YesNo = 'YES_NO';
    case Date = 'DATE';

    public function usesOptions(): bool
    {
        return in_array($this, [self::SingleChoice, self::MultipleChoice, self::Dropdown], true);
    }
}
