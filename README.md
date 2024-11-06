# Combination API - CDK, Projen, Typescript

> remix of Sam Williams' - [Sam Williams's - Conquer Serverless with 7 Practical Projects]()

Original project uses Serverless Framework v3,

## Background

Having recently worked through Sam's course producing the Serverless Framework project here - https://github.com/alanionita/aws-sls-combination-api

Now that SLS is no longer open-source I decided to challenge myself and learn CDK + projen:
    - CDK for AWS IaC rules
    - Projen for templating

## Description

Architecture:
- API Gateway - HTTP API
- Lambda

Features:

- Fetches a JSON list of latest Steam game discounts
    - Ordered by game rating
- Calculates discounts in GBP with real-time currency conversion

Tech stories:
- API Gateway 
    - GET /gameDeals
    - Supports query params 
    - `?currency` eg. `?currency=gbp`

- Lambda
    - Calls 2 other api
    - Error handling
    - Response combining into a valid response
     - Type definitions



Differences from original
- Projen scaffold
    - Does not contain Github Actions workflows
- CDK config for AWS infrastructure-as-code
- Serverless Framework requires lambdas to be stored in `src/functions/*`
    - Here changed to `src/lambdas/*` simply because it makes it easier to map AWS services to code
- Serverless Framework automatically names services as `service-stage`
    - Here implemented with StackProps.stage
- Serverless Framework would produce a deployment / stage, taking a list of stages 
    - Here each stage is a new Stack instance and has to be manually defined
    ```typescript
    // src/main.ts
    new CombinationApi(cdkApp, 'aws-cdk-combination-api', {
        env: devEnv,
        stage: 'dev' // Or 'prod', 'beta'
    })

    ```

Future plans:
- Implement compressed responses from Lambda
    - Currently around 5kb without any compression
    - Serverless Framework has built-in support for this via `minimumCompressionSize` set to 1024 (1mb)

## Usage

### Pre-requisites

OS-level installs
- aws-cli (AWS tooling)
    - [ ] Install it on local machine
    - [ ] Create an account using IAM in the AWS Console
    - [ ] Configure the aws cli with `aws configure` and the above account
        - Project will use default local account, but can be given other accounts via `--profile $CUSTOM` flag 
- volta (Node tooling)
    - [ ] Install in on local machine
    - [ ] Install Node v20
- Postman
    - For API testing

Configuration
- CDK bootstrap
    - run `cdk bootstrap aws://$ACCOUNT_NO/$REGION --verbose` to bootstap CDK

### Developing

- [ ] Clone repo
    - Update names in `.projenrc.ts`
- [ ] Install node packages `npm i`
- [ ] Synthesize the project with `projen synth`
- [ ] Build project with `projen build`
- [ ] Test project with `projen test`
- [ ] Deploy (after green outputs from above)
    - `projen deploy`
    - Deployment will output the apiEndpoint or URL
- [ ] Destroy
    - `project destroy`

### Using the api

- Open Postman
- GET request to `API_ENDPOINT/gameDeals?currency=gbp`

Output sample:

```json
[
    {
        "title": "Ghostwire Tokyo",
        "storeID": "25",
        "steamRatingPercent": "83",
        "salePrice": 0,
        "normalPrice": 46.32305696841051,
        "savingsPercent": "100.000000",
        "releaseDate": "Fri Mar 25 2022"
    },
    {
        "title": "Need for Speed Unbound",
        "storeID": "8",
        "steamRatingPercent": "61",
        "salePrice": 7.559638735134836,
        "normalPrice": 54.04485342922239,
        "savingsPercent": "86.012287",
        "releaseDate": "Fri Dec 02 2022"
    },
    ...
]

```


## Authors

- Alan Ionita
- Sam Williams - handler and lib

## Credits 

- Sam Williams - Lambda handler and Serverless Framework setup
- Projen - for `awscdk-app-ts` template

## License

Apache 2.0
