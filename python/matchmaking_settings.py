from typing import List
from enum import Enum
from pydantic import BaseModel

class RuleEnum(str, Enum):
    MIN = 'MIN'
    MAX = 'MAX'
    EQUAL = 'EQUAL'

class Constraint(BaseModel):
    rule: RuleEnum
    schools: List[str]
    value: int
    multiple: bool

class MatchmakingSettings(BaseModel):
    isActive: bool
    teamSizeMin: int
    teamSizeMax: int
    constraints: List[Constraint]