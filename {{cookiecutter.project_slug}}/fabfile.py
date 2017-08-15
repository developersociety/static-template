# -*- coding: utf-8 -*-

from fabric.api import cd, env, parallel, roles, run, task
from fabric.contrib.files import exists

# Changable settings
env.roledefs = {
    'web': [
        'staticsites@cornwall.devsoc.org',
        'staticsites@devon.devsoc.org',
    ],
}

env.home = env.get('home', '/var/www/staticsites/{{ cookiecutter.project_slug }}')
env.repo = env.get('repo', '{{ cookiecutter.project_slug }}')

# Avoid tweaking these
env.use_ssh_config = True
GIT_REMOTE = 'git@github.com:developersociety/{env.repo}.git'


@task
@roles('web')
@parallel
def deploy(branch=None):
    """
    Deploy to remote server.

    fab deploy
    fab deploy:branch
    """
    if not exists(env.home):
        run('mkdir -p {}'.format(env.home))

    with cd(env.home):
        if not exists('.git'):
            git_repo = GIT_REMOTE.format(env=env)
            run('git clone --quiet --recursive {} .'.format(git_repo))

        if branch is not None:
            run('git fetch')
            run('git checkout {}'.format(branch))

        run('git pull --quiet')
