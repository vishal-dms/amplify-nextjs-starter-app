import { defineBackend } from "@aws-amplify/backend";
import { aws_appsync as appsync } from "aws-cdk-lib";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";

const backend = defineBackend({
  auth,
  data,
});

// export const configureResolverCache = (
//   resolver: appsync.CfnResolver,
//   config: IResolverCacheConfig = {}
// ): void => {
//   if (!ENABLE_APPSYNC_CACHE) {
//     return;
//   }

//   const { ttl = 300, cachingKeys = ["$context.arguments.id"] } = config;

//   if (!resolver) {
//     throw new Error(resolver);
//   }

//   resolver.cachingConfig = {
//     ttl,
//     cachingKeys,
//   };
// };

// const RESOLVER_GET_MENU_SECTIONS_FOR_RESTAURANT =
//   backend.data.resources.cfnResources.cfnResolvers[
//     "Query.getMenuSectionsForRestaurant"
//   ];

// const RESOLVER_GET_MENU_PICKER_FOR_RESTAURANT =
//   backend.data.resources.cfnResources.cfnResolvers[
//     "Query.getMenuPickerForRestaurant"
//   ];

// configureResolverCache(RESOLVER_GET_MENU_SECTIONS_FOR_RESTAURANT, {
//   ttl: 300,
//   cachingKeys: ["$context.arguments.id"],
// });

// configureResolverCache(RESOLVER_GET_MENU_PICKER_FOR_RESTAURANT, {
//   ttl: 300,
//   cachingKeys: ["$context.arguments.id"],
// });

// export const createApiCache = (
//   construct: Construct,
//   identifier: string,
//   apiId: string,
//   config: IApiCacheConfig = {}
// ): CfnApiCache | void => {
//   if (!ENABLE_APPSYNC_CACHE) {
//     return;
//   }

//   const {
//     ttl = 300,
//     type = "SMALL",
//     apiCachingBehavior = "PER_RESOLVER_CACHING",
//     atRestEncryptionEnabled = true,
//     transitEncryptionEnabled = true,
//   } = config;

//   const stack = Stack.of(construct);

//   return new CfnApiCache(stack, identifier, {
//     apiId,
//     ttl,
//     type,
//     apiCachingBehavior,
//     atRestEncryptionEnabled,
//     transitEncryptionEnabled,
//   });
// };

// createApiCache(backend.data, "MyApiCache", backend.data.apiId, {
//   ttl: 300,
//   type: "SMALL",
//   apiCachingBehavior: "PER_RESOLVER_CACHING",
// });

const cfnApiCache = new appsync.CfnApiCache(backend.stack, "MyCfnApiCache", {
  apiCachingBehavior: "PER_RESOLVER_CACHING",
  apiId: backend.data.resources.graphqlApi.apiId,
  ttl: 123,
  type: "SMALL",

  // the properties below are optional
  atRestEncryptionEnabled: true,
  transitEncryptionEnabled: true,
});

const LIST_TODO =
  backend.data.resources.cfnResources.cfnResolvers["Query.listTodos"];

LIST_TODO.cachingConfig = {
  cachingKeys: ["$context.arguments.limit", "$context.arguments.nextToken"],
  ttl: 60, // Cache TTL in seconds
};

// LIST_TODO.addOverride("DependsOn", cfnApiCache.logicalId);
