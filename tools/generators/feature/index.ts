import {
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url
} from '@angular-devkit/schematics';
import type { FeatureModuleSchema } from './schema';
import { strings } from '@angular-devkit/core';
import * as schematicsAngularUtility from '../shared/ng-utils';
import * as schematicsCustomUtility from '../shared/utils';
import { mergeAll, isNil } from 'ramda';

export default function(schema: FeatureModuleSchema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const defaults: FeatureModuleSchema = {
      commonModule: undefined,
      flat: undefined,
      lintFix: true,
      module: undefined,
      name: '',
      path: undefined,
      project: undefined,
      routing: undefined,
      routingScope: undefined,
      export: false
    };

    const { titlize } = schematicsCustomUtility;
    const {
      getWorkspace,
      findModuleFromOptions,
      parseName
    } = schematicsAngularUtility;

    const workspace = getWorkspace(host);

    if (!schema.project) {
      schema.project = Object.keys(workspace.projects)[0];
    }

    const project = workspace.projects[schema.project];

    if (isNil(schema.path)) {
      const projectDirName =
        project.projectType === 'application' ? 'app' : 'lib';

      schema.path = `/${project.root}/src/${projectDirName}`;
    }

    schema.module = findModuleFromOptions(host, schema);

    const { name, path } = parseName(schema.path, schema.name);
    const featureModulePath: string = `${path}/features`;

    schema.name = name;
    schema.path = featureModulePath;
    schema.prefix = project.prefix;

    const templateOptions = mergeAll([defaults, strings, schema, { titlize }]) as FeatureModuleSchema;

    const templateSource = apply(url('./files'), [
      applyTemplates(templateOptions),
      move(featureModulePath)
    ]);

    const rule = chain([branchAndMerge(chain([mergeWith(templateSource)]))]);

    return rule(host, context);
  };
}