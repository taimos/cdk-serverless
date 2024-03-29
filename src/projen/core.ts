import * as pj from 'projen';

export const PACKAGE_NAME = 'cdk-serverless';

export interface ServerlessProjectOptions extends pj.awscdk.AwsCdkTypeScriptAppOptions {
  //
}

export class ServerlessProject extends pj.awscdk.AwsCdkTypeScriptApp {

  constructor(options: ServerlessProjectOptions) {
    super({
      ...options,
      projenrcTs: true,
      deps: [
        ...options.deps ?? [],
        'uuid',
        'esbuild',
        'js-yaml',
      ],
      devDeps: [
        ...options.devDeps ?? [],
        '@types/aws-lambda',
        '@types/uuid',
        '@types/lambda-log',
        '@types/js-yaml',
      ],
    });

  }

}