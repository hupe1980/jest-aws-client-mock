const { TypeScriptProject, UpgradeDependenciesSchedule } = require('projen');

const project = new TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'jest-aws-client-mock',
  description: 'Jest mock for AWS SDK v3 Clients',
  keywords: ['jest', 'mock', 'aws-sdk-v3', 'aws', 'aws-client'],
  repository: 'https://github.com/hupe1980/jest-aws-client-mock.git',
  license: 'MIT',
  copyrightOwner: 'Frank Hübner',
  releaseToNpm: true,
  devDeps: ['@aws-sdk/client-sns', '@aws-sdk/types', 'jest'],
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: 'AUTOMATION_GITHUB_TOKEN',
      schedule: UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  autoApproveUpgrades: true,
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['hupe1980'],
  },
});
project.gitignore.exclude('.DS_Store');
project.synth();