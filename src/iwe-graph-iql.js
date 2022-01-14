import React from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

function mkGraphQLFetcher(iweFetcher, endpoint) {
  return (graphQLParams, opts) => {
    return iweFetcher.fetch(
      endpoint,
      {
        method: 'post',
        headers: Object.assign(
          {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          opts && opts.headers,
        ),
        body: JSON.stringify(graphQLParams),
        credentials: 'omit',
      },
    ).then(function (response) {
      return response;
    });
  };
}

function IweGraphiQL({
  envs = [
    {
      "id": "123",
      "name": "CET"
    },
    {
      "id": "456",
      "name": "CLICS"
    }
  ],
  iweFetcher
}) {
  const initialState = {
    authorization: null,
    env: envs[0],
  };

  const [state, setState] = React.useState(initialState);

  const endpoint = `/api/${state.env.id}/graphql`;

  const toolbar = <React.Fragment>
    <GraphiQL.Menu
      title={state.env.name}
      label={state.env.name}
    >
      {envs.map((env) => {
        return <GraphiQL.MenuItem
          key={env.id}
          label={env.name}
          value={env.id}
          onSelect={() => setState({...state, env})}
        >
        </GraphiQL.MenuItem>;
      })}
    </GraphiQL.Menu>
  </React.Fragment>;

  React.useEffect(() => {
    iweFetcher.setHandleAuthorizationChanged((token) => {
      return setState({
        ...state,
        authorization: `JWT ${token}`
      });
    })
  }, []);

  return <GraphiQL
    defaultVariableEditorOpen={true}
    fetcher={mkGraphQLFetcher(iweFetcher, endpoint)}
    headerEditorEnabled={true}
    headers={JSON.stringify({'Authorization': state.authorization})}
    toolbar={{
      additionalContent: toolbar
    }}
  >
  </GraphiQL>;
}

export default IweGraphiQL;
