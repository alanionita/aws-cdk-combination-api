import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'aws-cdk-combination-api',
  projenrcTs: true,
  packageManager: javascript.NodePackageManager.NPM,
  description: "CDK remix of Combination API project, Sam Williams's - Conquer Serverless with 7 Practical Projects",
  deps: ['aws-lambda', 'axios'],
  devDeps: ['@types/aws-lambda', '@types/node'],
});
project.synth();