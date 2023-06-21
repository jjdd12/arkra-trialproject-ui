import React from 'react';
import './App.css';
import Graph from "./Graph";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

// @ts-ignore
const defaultQueryFn = async ({ queryKey }) => await fetch("http://localhost:5181/" + queryKey[0],
        { headers: {'Content-Type': 'application/json'}})
        .then(response => response.json())

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: defaultQueryFn,
        },
    },
})

function App() {
    return (
        <div className="App">
            <QueryClientProvider client={queryClient}>
                <Graph/>
            </QueryClientProvider>
        </div>
    );
}
export default App;
