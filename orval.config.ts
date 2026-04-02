import { defineConfig } from 'orval';

export default defineConfig({
    tomado: {
        input: {
            target: 'https://raw.githubusercontent.com/prgrms-fullcycle-devcourse/webfull_9_10_Tomado_BE/develop/src/swagger/openapi.yaml',
        },
        output: {
            target: './src/api/generated/index.ts',
            schemas: './src/api/generated/model',
            client: 'react-query',
            mode: 'tags-split',
            httpClient: 'fetch',
            prettier: true,
            override: {
                mutator: {
                    path: './src/api/mutator/custom-instance.ts',
                    name: 'customInstance',
                },
                query: {
                    useQuery: true,
                    usePrefetch: true,
                    signal: true,
                },
                fetch: {
                    includeHttpResponseReturnType: false,
                },
            },
        },
    },
});
