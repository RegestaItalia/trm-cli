# Custom registry
If you wish, you can use a custom registry instead of the [public registry](https://www.trmregistry.com/).
Run the command
`trm addRegistry <name>`
to add your custom registry.
Alternatively, you can edit the `registry.ini` file you can find at `{ROAMING FOLDER}/trm/registry.ini`.
The ini file has this structure:
```
[{REGISTRY NAME}]
address={REGISTRY ENDPOINT}
username={USERNAME}
password={PASSWORD}
```
When adding a custom registry, mind that the name `public` is a reserved keyword.

## Creating a custom registry
You might have noticed that to add a custom registry you have to provide an endpoint.
To create a custom registry, you'll have to implement the following REST APIs on your server.
To guarantee all trm operations working, implement all the APIs listed below.
- [Ping](#ping)
- [Who am I](#who-am-i)
- [View package](#view-package)
- [Publish package](#publish-package)
- [Unpublish package](#unpublish-package)
- [Get artifact](#get-artifact)

You will also need to handle authentication, as some of the endpoint you want to implement might require it.
Currently, the supported authentication is [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).


## Ping
- Endpoint: `/`
- Method: `GET`
- Request parameters: `empty`
- Response type: `JSON`
- Response structure:
```
{
    "logonMessage": {
        "type": {MESSAGE TYPE: string},
        "text": {MESSAGE TEXT: string}
    },
    "wallMessage": {
        "type": {MESSAGE TYPE: string},
        "text": {MESSAGE TEXT: string}
    }
}
```
This is the first request from trm to the registry, and it expects response number 200.
The response might also have a JSON object containing a logon message and wall message.
The wall message is shown every time trm connects to the registry, and it can be of type `info` or `warn`.
The logon message is shown when a user logs into the registry, and it can be of type `info` or `warn`.

## Who am I
- Endpoint: `/whoami`
- Method: `GET`
- Request parameters: `empty`
- Response type: `JSON`
- Response structure:
```
{
    "username": {LOGGED USER USERNAME: string}
}
```
This request is sent from trm to the registry whenever it's needed to know information about the logged user, and it expects response number 200.
The response must have a JSON object containing the logged user information.

## View package
- Endpoint: `/view`
- Method: `GET`
- Request parameters: `name, version`
- Response type: `JSON`
- Response structure:
```
{
    "name": {PACKAGE NAME: string},
    "private": {PACKAGE PRIVATE: boolean},
    "shortDescription": {PACKAGE SHORT DESCRIPTION: string?},
    "website": {PACKAGE MANIFEST WEBSITE: string?},
    "git": {PACKAGE MANIFEST GIT: string?},
    "license": {PACKAGE MANIFEST LICENSE},
    "userAuthorizations": {
        "canCreateReleases": {LOGGED USER CAN PUBLISH RELEASE: boolean}
    },
    "release": {
        "version": {PACKAGE RELEASE VERSION: string},
        "deprecated": {PACKAGE RELEASE DEPRECATED: boolean},
        "latest": {PACKAGE RELEASE LATEST: boolean}
    }
}
```
This request is sent from trm to the registry whenever the command view is executed, and it expects response number 200 when the corresponding package and release is found.
The response must have a JSON object containing the package and release information.

## Publish package
- Endpoint: `/publish`
- Method: `POST`
- Request form data:
```
name: {PACKAGE NAME: string}
version: {PACKAGE VERSION TO PUBLISH: string}
private: {PACKAGE PRIVATE: boolean?}
distPath: {PACKAGE ARTIFACT DIST FOLDER PATH: string}
artifact: {PACKAGE ARTIFACT: binary}
shortDescription: {PACKAGE SHORT DESCRIPTION: string?}
website: {PACKAGE MANIFEST WEBSITE: string?}
git: {PACKAGE MANIFEST GIT URL: string?}
authors: {PACKAGE MANIFEST AUTHORS: string?}
keywords: {PACKAGE KEYWORDS: string?}
license: {PACKAGE LICENSE: string?}
requirements: {PACKAGE SYSTEM REQUIREMENTS: string}
dependencies: {PACKAGE DEPENDENCIES: string}
```
This request is sent from trm to the registry whenever the publish command is executed, and it expects response number 200 when publishing is completed.
Notice the parameters are sent as form data; they contain package information (not always provided, depending on the case), and the binary artifact itself.
The requirements and dependencies parameters as JSON strings.

# Unpublish package
- Endpoint: `/unpublish`
- Method: `POST`
- Request body:
```
{
    name: {PACKAGE NAME: string},
    version: {PACKAGE VERSION: string?}
}
```
This request is sent from trm to the registry whenever the unpublish command is executed, and it expects response number 200 when unpublishing is completed.
The version might not be specified: in this case, it's expected that all versions of a package are removed from the registry.

## Get artifact
- Endpoint: `/getArtifact`
- Method: `GET`
- Request parameters: `name, version`
- Response type: `application/octet-stream`

This request is sent from trm to the registry whenever an artifact is needed, and it expects the binary as the response.
The version might not be specified: in this case, it's expected that all versions of a package are removed from the registry.
