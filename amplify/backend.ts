import { defineBackend } from "@aws-amplify/backend";
import { aws_appsync as appsync } from "aws-cdk-lib";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";

const backend = defineBackend({
  auth,
  data,
});

const cfnApiCache = new appsync.CfnApiCache(backend.stack, "MyCfnApiCache", {
  apiCachingBehavior: "PER_RESOLVER_CACHING",
  apiId: backend.data.resources.graphqlApi.apiId,
  ttl: 123,
  type: "SMALL",

  // the properties below are optional
  atRestEncryptionEnabled: true,
  transitEncryptionEnabled: true,
});

const GET_TODO =
  backend.data.resources.cfnResources.cfnResolvers["Query.getTodo"];

GET_TODO.cachingConfig = {
  cachingKeys: ["$context.arguments.id"],
  ttl: 60, // Cache TTL in seconds
};

const LIST_TODOS =
  backend.data.resources.cfnResources.cfnResolvers["Query.listTodos"];

LIST_TODOS.cachingConfig = {
  cachingKeys: ["$context.arguments.limit", "$context.arguments.nextToken"],
  ttl: 60, // Cache TTL in seconds
};
