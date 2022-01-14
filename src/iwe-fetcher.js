const coreHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
}

async function recursiveFetch(ctx, url, config) {
  const authHeaders = {
    'Authorization': `JWT ${ctx.state.token}`
  };

  const attempt = await fetch(
    url,
    {
      ...config,
      headers: {
        ...coreHeaders,
        ...authHeaders,
        ...config.headers
      }
    }
  );

  if (attempt.ok) {
    return attempt.json();
  }

  if (!(ctx.canRetry && attempt.status === 401)) {
    console.error(attempt);
    return;
  }

  const refreshToken = localStorage.getItem('refreshToken');
  const authAttempt = await fetch(
    `${ctx.state.baseUrl}/api/refreshjwt`,
    {
      method: 'post',
      headers: coreHeaders,
      body:  JSON.stringify({
        refreshToken
      })
    }
  );

  if (!authAttempt.ok) {
    throw new Error('Unable to refresh token');
  }

  const authAttemptBody = await authAttempt.json();
  const accessToken = authAttemptBody.accessToken;

  ctx.canRetry = false;
  ctx.state.token = accessToken;
  localStorage.setItem('accessToken', accessToken);
  if (ctx.state.onAuthorizationChanged) {
    await ctx.state.onAuthorizationChanged(accessToken);
  }

  return recursiveFetch(ctx, url, config)
}


class IweFetcher {
  constructor() {
    this.baseUrl = window.location.origin;
    this.token = localStorage.getItem('accessToken');
  }

  async fetch(url, config) {
    const ctx = {
      canRetry: true,
      state: this
    };

    return await recursiveFetch(
      ctx,
      `${this.baseUrl}${url}`,
      config
    );
  }

  setHandleAuthorizationChanged(callback) {
    this.onAuthorizationChanged = callback;

    return this.onAuthorizationChanged(this.token);
  }
}

export default IweFetcher;
