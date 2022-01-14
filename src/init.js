import IweFetcher from './iwe-fetcher';

async function authenticate(iweFetcher) {
  return iweFetcher.fetch(
    '/api/docs-auth',
    {
      method: 'get'
    }
  );
}

async function getEnvs(iweFetcher) {
  const result = await iweFetcher.fetch(
    '/api/environments',
    {
      method: 'get'
    }
  );

  return result._embedded.environments.map(
    env => ({
      id: env._id.$id,
      name: env.name
    })
  )
}

async function init() {
  const iweFetcher = new IweFetcher();

  await authenticate(iweFetcher);
  const envs = await getEnvs(iweFetcher);

  return {
    iweFetcher,
    envs
  };
}

export default init;