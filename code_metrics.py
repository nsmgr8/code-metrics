#!/usr/bin/env python3

"""
Collect some code metrics for python projects.

    * Code complexity
        CC Score        Rank        Risk
        ===========================================
        1-5             A           low - simple block
        6-10            B           low - well structured and stable block
        11-20           C           moderate - slightly complex block
        21-30           D           more than moderate - more complex block
        31-40           E           high - complex, alarming
        41+             F           very high - error-prone, unstable block
    * Maintainability
        MI Score        Rank        Maintainability
        ===========================================
        100-20          A           Very High
        19-10           B           Medium
        9-0             C           Extremely Low
    * Lines of Code:
        LOC: the total number of lines of code,
        LLOC: the number of logical lines of code,
        SLOC: the number of source lines of code
              not necessarily corresponding to the LLOC

The metrics will be found in the `code-metrics.json` file.
"""

import argparse
import contextlib
import json
import os
import subprocess
from functools import partial
from multiprocessing import Pool

HERE = os.path.dirname(os.path.realpath(__file__))
TYPES = {
    'F': 'function',
    'C': 'class',
    'M': 'method',
}


@contextlib.contextmanager
def within_dir(folder):
    """
    context manager to execute the function within the given folder
    after the execution change back to the original folder
    :param folder: full path of the folder to switch to
    """
    cwd = os.getcwd()
    os.chdir(folder)
    yield
    os.chdir(cwd)


def run(cmd):
    """
    :param cmd: run the given command in subprocess
    :return: the stdout of the completed process
    """
    p = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE)
    return p.stdout.decode()


def get_value(cmd):
    """
    Runs a command that outputs a json dict
    :param cmd: the command to run in a subprocess
    :return: the first value of the json dict output or empty dict
    """
    for v in json.loads(run(cmd)).values():
        return v
    return {}


def get_commit(fpath):
    """
    Get the git commit info for the given file
    :param fpath: the file path
    :return: dict of commit sha and commit date
    """
    cmd = f'git log -1 --pretty="format:%h %at" {fpath}'
    commit, date = run(cmd).split(None, 1)
    return {'commit': commit, 'date': date}


def collect_all(project):
    """
    Collect all the metrics for the given project
    :param project: project root path
    :return: the list of metrics per file
    """
    metrics = []
    pyfiles = []

    cached_metrics = load_metrics()

    with within_dir(project):
        pyfiles = [f for f in run('git ls-files').split() if f.endswith('.py')]

    num_pools = max(os.cpu_count() - 1, 1)
    n_files = len(pyfiles)

    with Pool(num_pools) as pool:
        for i, result in enumerate(pool.imap_unordered(
            partial(collect_metrics, project, cached_metrics),
            pyfiles
        ), 1):
            print(f'\r{i / n_files:.2%} - {i}', end='')
            if result:
                metrics.append(result)

    return metrics


def collect_metrics(project, cached_metrics, pyfile):
    """
    Collect all the metrics for the python file in the project
    :param project: project root path
    :param pyfile: the python file
    :return: the list of metrics per file
    """
    with within_dir(project):
        try:
            commit = get_commit(pyfile)
            if cached_metrics.get(pyfile, {}).get('commit') == commit['commit']:
                return cached_metrics[pyfile]

            return {
                'file': pyfile,
                **commit,
                **get_value(f'radon raw -j {pyfile}'),
                **get_value(f'radon mi -j {pyfile}'),
                'cc': get_value(f'radon cc -j {pyfile}') or [],
            }
        except Exception as e:
            print('\rfailed to get metrics of', pyfile, e)


def load_metrics():
    """
    Load previously calculated metrics
    :return: dict(filepath, metrics)
    """
    metrics = {}

    with within_dir(HERE):
        try:
            with open('code-metrics.json') as f:
                metrics = json.loads(f.read())
        except Exception:
            pass

    return {x['file']: x for x in metrics.get('data', [])}


def save_metrics(data, meta):
    """
    Save the data to a json file
    :param data: a json serialisable dict
    :param meta: metadata
    """
    with within_dir(HERE):
        with open('code-metrics.json', 'w') as f:
            f.write(json.dumps({
                'data': data,
                'meta': meta,
            }))


def collect_meta(project, name):
    """
    Get metadata for the project
    :param project: project path
    :param name: the name of the project
    """
    name = name or os.path.basename(project.strip('/'))
    return {
        'name': name,
    }


def main(project, name):
    """
    The main entry of the program
    :param project: the project root path
    """
    project = os.path.expanduser(project)
    data = collect_all(project)
    meta = collect_meta(project, name)
    save_metrics(data, meta)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument('project', help='path to the project')
    parser.add_argument('-n', '--name', help='name of the project')
    parser.add_argument('-v', '--verbose', action='store_true')

    args = parser.parse_args()

    if not args.verbose:
        print = lambda *args, **kwargs: 0

    main(args.project, args.name)