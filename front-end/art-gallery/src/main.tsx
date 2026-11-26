import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // data is considered fresh for 5 minutes
            gcTime: 1000 * 60 * 30, // garbage collection time: 30 minutes
            retry: 1, // retry failed requests once
            refetchOnWindowFocus: true // refetch when window is focused
        }
    }
});

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>
)
