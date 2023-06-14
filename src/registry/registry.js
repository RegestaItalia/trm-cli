require("dotenv").config();
const axios = require('axios');
const { normalizeUrl } = require('../utils/commons');
const FormData = require('form-data');

module.exports = (registry) => {
    var axiosOptions;
    var usePublicRegistry = registry.name === 'public';
    const token = `${registry.username}:${registry.password}`;
    const encodedToken = Buffer.from(token).toString('base64');
    var baseUrl;
    if (usePublicRegistry) {
        baseUrl = process.env.TRM_PUBLIC_REGISTRY_ENDPOINT || 'https://trmregistry.regestaitalia.it/registry';
    } else {
        baseUrl = registry.address;
        if (baseUrl.length > 100) {
            throw new Error(`Registry "${registry.name}" address length is too long! Maximum allowed is 100.`);
        }
    }
    if(!baseUrl){
        throw new Error(`Registry url was not specified.`);
    }
    axiosOptions = {
        baseURL: baseUrl.trim(),
        headers: {
            'Authorization': `Basic ${encodedToken}`
        }
    };
    const axiosInstance = axios.create(axiosOptions);

    return {
        getName: () => {
            return usePublicRegistry ? 'TRM Public Registry' : registry.name;
        },
        getRegistryType: () => {
            return usePublicRegistry ? 'public' : 'private';
        },
        getAddress: () => {
            return usePublicRegistry ? 'public' : normalizeUrl(axiosOptions.baseURL);
        },
        logon: async () => {
            const response = (await axiosInstance.get('/whoami')).data;
            return response;
        },
        view: async (packageName, version) => {
            const args = {
                name: packageName,
                version
            }
            const response = (await axiosInstance.get('/view', { params: args })).data;
            return response;
        },
        publish: async (artifact, args) => {
            if (!artifact) {
                throw new Error('Missing publish artifact build');
            }
            if (!args.packageName) {
                throw new Error('Missing publish package name');
            }
            if (!args.version) {
                throw new Error('Missing publish version');
            }
            if (!args.distPath) {
                throw new Error('Missing publish dist path');
            }
            if(!args.cvers){
                throw new Error('Missing requirements');
            }
            const formData = new FormData();
            formData.append('artifact', artifact, 'package.trm');
            formData.append('name', args.packageName);
            formData.append('version', args.version);
            formData.append('private', args.private.toString());
            formData.append('distPath', args.distPath);
            formData.append('shortDescription', args.description || '');
            formData.append('git', args.gitRepository || '');
            formData.append('authors', args.authors ? args.authors.join(', ') : '');
            formData.append('keywords', args.keywords ? JSON.stringify(args.keywords) : '[]');
            formData.append('license', args.license || '');
            formData.append('requirements', JSON.stringify(args.cvers));
            formData.append('dependencies', JSON.stringify(args.dependencies || []));
            const response = (await axiosInstance.post('/publish', formData, {
                headers: formData.getHeaders()
            })).data;
            return response;
        },
        getArtifact: async (args) => {
            const response = (await axiosInstance.get('/getArtifact', {
                params: args,
                headers: {
                    'Accept': 'application/octet-stream'
                },
                responseType: 'arraybuffer'
            })).data;
            return response;
        }
    }
}