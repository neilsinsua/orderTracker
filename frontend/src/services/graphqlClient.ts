import {GraphQLClient} from 'graphql-request'
import {graphqlurl} from "./apiconfig.tsx";

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
}

const csrftoken = getCookie('csrftoken') || '';

export const graphqlClient = new GraphQLClient(graphqlurl, {
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
    },
})