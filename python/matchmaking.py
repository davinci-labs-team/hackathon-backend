import json
import sys
from matchmaking_settings import MatchmakingSettings
from ortools.sat.python import cp_model
from pathlib import Path

class User:
    def __init__(self, user_id: str, school: str):
        self.user_id = user_id
        self.school = school

TMP_DIR = Path(__file__).parent / 'tmp_matchmaking'

'''def load_users(path: Path = TMP_DIR / 'users.json'):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return [User(u['id'], u['school']) for u in data]


def load_settings(path: Path = TMP_DIR / 'matchmaking_config.json'):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return MatchmakingSettings.model_validate(data)'''

def load_users(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return [User(u['id'], u['school']) for u in data]

def load_settings(config_path):
    with open(config_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return MatchmakingSettings.model_validate(data)

def run_matchmaking(users_file, config_file):
    '''users = load_users()
    settings = load_settings()
'''
    # CHANGED
    users = load_users(users_file)
    settings = load_settings(config_file)

    model = cp_model.CpModel()
    num_users = len(users)
    
    # Maximum possible teams
    max_teams = num_users // settings.teamSizeMin + 1

    # Variable of team assignment for each user
    team_vars = [model.NewIntVar(0, max_teams, f'team_{u.user_id}') for u in users]

    # Boolean for user assigned
    user_assigned = []
    for idx in range(num_users):
        assigned = model.NewBoolVar(f'user_assigned_{idx}')
        model.Add(team_vars[idx] != max_teams).OnlyEnforceIf(assigned)
        model.Add(team_vars[idx] == max_teams).OnlyEnforceIf(assigned.Not())
        user_assigned.append(assigned)

    # Boolean for team used
    team_used = [model.NewBoolVar(f'team_used_{t}') for t in range(max_teams)]
    for t in range(max_teams):
        members_in_t = []
        for idx in range(num_users):
            member = model.NewBoolVar(f'user_{idx}_team_{t}')
            model.Add(team_vars[idx] == t).OnlyEnforceIf(member)
            model.Add(team_vars[idx] != t).OnlyEnforceIf(member.Not())
            model.AddImplication(member, user_assigned[idx])
            members_in_t.append(member)
        model.AddMaxEquality(team_used[t], members_in_t)

    # Min Team Size Penalty
    for t in range(max_teams):
        size = []
        for idx in range(num_users):
            b = model.NewBoolVar(f'user_{idx}_team_{t}_min')
            model.Add(team_vars[idx] == t).OnlyEnforceIf(b)
            model.Add(team_vars[idx] != t).OnlyEnforceIf(b.Not())
            size.append(b)
        if settings.isActive:
            model.Add(sum(size) >= settings.teamSizeMin).OnlyEnforceIf(team_used[t])
        else:
            model.Add(sum(size) <= 5).OnlyEnforceIf(team_used[t])

    # Max Team Size Penalty
    over_max_vars = []
    for t in range(max_teams):
        size = []
        for idx in range(num_users):
            b = model.NewBoolVar(f'user_{idx}_team_{t}_max')
            model.Add(team_vars[idx] == t).OnlyEnforceIf(b)
            model.Add(team_vars[idx] != t).OnlyEnforceIf(b.Not())
            size.append(b)
        count = sum(size)
        over_max = model.NewIntVar(0, num_users, f'over_max_{t}')
        if settings.isActive:
            model.Add(over_max >= count - settings.teamSizeMax)
        else:
            model.Add(over_max >= 0)
        over_max_vars.append(over_max)

    # Constrainsts on schools
    if settings.isActive:
        for t in range(max_teams):
            for constraint in settings.constraints:
                relevant = []
                for idx in range(num_users):
                    in_group = False
                    if constraint.multiple and users[idx].school in constraint.schools:
                        in_group = True
                    elif not constraint.multiple and users[idx].school == constraint.schools[0]:
                        in_group = True
                    if in_group:
                        b = model.NewBoolVar(f'user_{idx}_team_{t}_school')
                        model.Add(team_vars[idx] == t).OnlyEnforceIf(b)
                        model.Add(team_vars[idx] != t).OnlyEnforceIf(b.Not())
                        relevant.append(b)
                if relevant:
                    if constraint.rule == 'MIN':
                        model.Add(sum(relevant) >= constraint.value).OnlyEnforceIf(team_used[t])
                    elif constraint.rule == 'MAX':
                        model.Add(sum(relevant) <= constraint.value).OnlyEnforceIf(team_used[t])
                    elif constraint.rule == 'EQUAL':
                        model.Add(sum(relevant) == constraint.value).OnlyEnforceIf(team_used[t])


    model.Minimize(
        sum(over_max_vars) * 100000 +  # priorité à la satisfaction des contraintes
        sum(team_used) * 10 +          # priorité à l'utilisation minimale des équipes
        sum(user_assigned) * -100000   # priorité à l'affectation des utilisateurs
    )

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        teams = {t: [] for t in range(max_teams)}
        for idx, u in enumerate(users):
            team_id = solver.Value(team_vars[idx])
            if team_id != max_teams:
                teams[team_id].append({"user_id": u.user_id, "school": u.school})

        # JSON de sortie
        output_teams = []
        for t_id, members in teams.items():
            if members:
                output_teams.append({
                    "team_id": t_id,
                    "members": members
                })
        print(json.dumps(output_teams, indent=2, ensure_ascii=False))
    else:
        print(json.dumps([], indent=2))


if __name__ == "__main__":
    #run_matchmaking()
    if len(sys.argv) > 2:
        run_matchmaking(sys.argv[1], sys.argv[2])