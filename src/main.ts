import * as path from 'path';
import { App, Stack, StackProps, CfnOutput, Duration, aws_lambda, aws_apigatewayv2 } from 'aws-cdk-lib';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

type TStackProps = StackProps & {
  stage: string // Added to match sls “{service}-{stage}” pattern for naming API Gw
}

export class CombinationApi extends Stack {
  constructor(scope: Construct, id: string, props: TStackProps = { stage: 'dev' }) {
    super(scope, `${id}-${props.stage}`, props);

    // # Lambda

    // - Define props
    const nodejsProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
        nodeModules: ['axios'],
      },
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      },
      runtime: aws_lambda.Runtime.NODEJS_20_X,
    };

    const combinationProps = {
      bundling: {
        nodeModules: ['axios'],
      },
      environment: {
        API_STEAM_ENDP: 'https://www.cheapshark.com/api/1.0/deals?upperPrice=15&pageSize=25',
        API_CURR_ENDP: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/',
      },
      memorySize: 1024,
      timeout: Duration.seconds(10),
    };

    const combinationLambda: NodejsFunctionProps = {
      entry: path.join(__dirname, 'lambdas', 'combination', 'index.ts'),
      ...nodejsProps,
      ...combinationProps,
    };

    // - Create function
    const combinationLmd = new NodejsFunction(this, `combination-${props.stage}`, combinationLambda);


    // - Create http Lambda integration

    const combinationLambdaItg = new HttpLambdaIntegration(`combination-integration-${props.stage}`, combinationLmd);

    // # API Gateway

    const apiGw = new HttpApi(this, `combinationApi-${props.stage}`);

    apiGw.addRoutes({
      path: '/gameDeals',
      methods: [aws_apigatewayv2.HttpMethod.GET],
      integration: combinationLambdaItg,
    });
    // 👇 create an Output for the API URL
    new CfnOutput(this, 'apiUrl', { value: apiGw.apiEndpoint });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const cdkApp = new App();

new CombinationApi(cdkApp, 'aws-cdk-combination-api', {
  env: devEnv,
  stage: 'dev',
  tags: {
    CanIDelete: 'no',
    Author: 'Alan Ionita',
    Created: '05-11-2024',
    Expires: '05-11-2024',
  },
});

cdkApp.synth();