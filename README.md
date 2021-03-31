[![npm version](https://badge.fury.io/js/cdk-serverless.svg)](https://badge.fury.io/js/cdk-serverless)

CDK Serverless is a tool suite to facilitate the use of the AWS CDK in serverless architectures. It provides project management features to configure your TypeScript CDK App and Higher-level (L3) constructs for different APIs and resources needed for serverless applications. Additionally it leverages utility libraries to write Lambda functions and do live updates to Lambda function code during development.

### Features

- Projen helper classes to configure certain use cases easily
- AWS CDK L3-construct for HttpApi and GraphQlApi
- Zeroconfig for Lambda functions and VTL templates
- Liveupdate to Lambda function code using cdk-watch
- Automatic DynamoDB SingleTable infrastructure
- Automatic Monitoring added for Lambda and APIs
- Full features of CDK usable to implement your special use cases
- Fully typed auto-completion for Routes, Resolvers, etc.

## Quick Start

To start a new project we recommend using projen. To use CDK Serverless you can create any projen CDK Typescript app and then add the appropriate aspect provided by this toolkit.

```bash
$ npx projen new awscdk-ts-app
```

Add 'cdk-serverless' as a dependency to your project and run 'npx projen'. You can then add the 'GraphQlApiAspect' or the 'HttpApiAspect' depending on your desired API type.

```ts
const { HttpApiAspect } = require('cdk-serverless');
const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.91.0',
  cdkVersionPinning: true,
  defaultReleaseBranch: 'main',
  name: 'cdk-serverless-demo',
  deps: [
    // Add cdk-serverless as dependency
    'cdk-serverless',
  ],
});

// Add HTTP API Support
new HttpApiAspect(project, {
  cdkWatch: {
    // Add live update scripts using CDK Watch
    dev: 'my-http-stack-dev/**',
  },
});

project.synth();
```

This will add all the necessary dependencies and register some scripts like `generate:api` to generate type definitions from the `openapi.yaml` and `live:dev` to watch for code changes and redeploy Lambda function code.

After this you can add the selected L3 construct to your CDK app and configure it depending on your needs.

```ts
import { HttpApi } from 'cdk-serverless';
import { paths, operations } from './lambda/types.generated';

// Create a new HTTP API
const api = new HttpApi<paths, operations>(this, 'Api', {
  // Name of the API in the AWS console
  apiName: 'testapi',
  // This will be prefix with api. by default and will lead to https://api.taimos.de
  domainName: 'taimos.de',
  // Name of the stage in a multi-stage deployment
  stageName: 'dev',
  // Automatically create a DynamoDB table and configure a global secondary index
  singleTableDatastore: {
    design: {
      reverseGSI: true,
    },
  },
  // Add a Cognito user pool with two groups and a trigger to customize welcome e-mails
  authentication: {
    groups: {
      admin: 'Admins',
      moderators: 'Mods',
    },
    triggers: {
      customMessages: true,
    },
  },
  // automatically generate lambda functions for all route in openapi.yaml (true by default)
  autoGenerateRoutes: true,
  // Create a CloudWatch Dashboard to monitor the API and all Lambda function (true by default)
  monitoring: true,
});
```

On the first `cdk synth` this will automatically bootstrap all lambda code files that are not yet existing. If you want to modify Lambda function definitions you can access the by calling:

```ts
api.getFunctionForOperation('operationId').xxx
```

This operation id support autocompletion using the generated type definitions.

<TODO GIF for autocomplete>

## Docs Links

- [FAQ](FAQ.md)
- [Issues / Features](https://github.com/taimos/cdk-serverless/issues)
- [Roadmap](https://github.com/taimos/cdk-serverless/projects)

## Constructs

### Projen

#### HttpApiAspect

#### GraphQlApiAspect

### CDK L3

#### HttpApi

#### GraphQlApi

#### SingleTableDatastore

#### Monitoring

#### AssetCdn

#### Authentication

#### LambdaFunction

### Tools

- [Lambda Toolbox](https://github.com/taimos/lambda-toolbox)
- [CDK Watch](https://github.com/teamplanes/cdk-watch)

## Contribute

### How to contribute to CDK Serverless

#### **Did you find a bug?**

* **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/taimos/cdk-serverless/issues).

* If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/taimos/cdk-serverless/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

#### **Did you write a patch that fixes a bug?**

* Open a new GitHub pull request with the patch.

* Ensure the PR description clearly describes the problem and solution. Include the relevant issue number if applicable.

#### **Did you fix whitespace, format code, or make a purely cosmetic patch?**

Changes that are cosmetic in nature and do not add anything substantial to the stability, functionality, or testability will normally not be accepted.

#### **Do you intend to add a new feature or change an existing one?**

* Suggest your change under [Issues](https://github.com/taimos/cdk-serverless/issues).

* Do not open a pull request on GitHub until you have collected positive feedback about the change.

#### **Do you want to contribute to the CDK Serverless documentation?**

* Just file a PR with your recommended changes

## Authors

Brought to you by [Taimos](https://taimos.de)