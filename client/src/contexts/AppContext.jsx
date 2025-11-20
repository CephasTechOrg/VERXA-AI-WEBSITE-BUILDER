import React, { createContext, useContext, useReducer } from 'react';
import { websiteAPI } from '../services/api';

const AppContext = createContext();

const initialState = {
    websiteType: null,
    userData: {},
    colorScheme: 'modern-blue',
    generatedWebsite: null,
    loading: false,
    step: 'home',
    error: null,
    lastGenerationRequest: null,
    deployment: null,
    deploymentLoading: false
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_WEBSITE_TYPE':
            return {
                ...state,
                websiteType: action.payload,
                step: 'generator',
                error: null
            };

        case 'UPDATE_USER_DATA':
            return {
                ...state,
                userData: { ...state.userData, ...action.payload }
            };

        case 'SET_COLOR_SCHEME':
            return {
                ...state,
                colorScheme: action.payload
            };

        case 'GENERATE_WEBSITE_START':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'GENERATE_WEBSITE_SUCCESS':
            return {
                ...state,
                loading: false,
                generatedWebsite: action.payload,
                step: 'preview'
            };

        case 'GENERATE_WEBSITE_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case 'DEPLOYMENT_START':
            return {
                ...state,
                deploymentLoading: true,
                error: null
            };

        case 'DEPLOYMENT_SUCCESS':
            return {
                ...state,
                deploymentLoading: false,
                deployment: action.payload,
                error: null
            };

        case 'DEPLOYMENT_ERROR':
            return {
                ...state,
                deploymentLoading: false,
                error: action.payload
            };

        case 'RESET_GENERATOR':
            return {
                ...initialState
            };

        case 'SET_LAST_GENERATION_REQUEST':
            return {
                ...state,
                lastGenerationRequest: action.payload
            };

        case 'GO_BACK':
            return {
                ...state,
                step: action.payload,
                error: null
            };

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const generateWebsite = async (websiteType, userData, colorScheme, customizations, uploadedImages) => {
        try {
            const payload = {
                websiteType,
                userData,
                colorScheme,
                customizations,
                uploadedImages // Include uploaded images
            };

            dispatch({ type: 'SET_LAST_GENERATION_REQUEST', payload });

            console.log('Sending generation request...');
            const response = await websiteAPI.generate(payload);
            console.log('Received response:', response);
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(error.message || 'Failed to generate website');
        }
    };

    const deployWebsite = async (html, websiteType, userData) => {
        try {
            console.log('🚀 Deploying to Netlify (no regeneration)...');
            const payload = {
                html,
                websiteType,
                userData
            };

            const response = await websiteAPI.deploy(payload);
            console.log('Deployment successful:', response);
            return response;
        } catch (error) {
            console.error('Deployment error:', error);
            throw new Error(error.message || 'Failed to deploy website');
        }
    };

    const actions = {
        setWebsiteType: (type) => dispatch({ type: 'SET_WEBSITE_TYPE', payload: type }),
        updateUserData: (data) => dispatch({ type: 'UPDATE_USER_DATA', payload: data }),
        setColorScheme: (scheme) => dispatch({ type: 'SET_COLOR_SCHEME', payload: scheme }),
        generateWebsiteStart: () => dispatch({ type: 'GENERATE_WEBSITE_START' }),
        generateWebsiteSuccess: (website) => dispatch({ type: 'GENERATE_WEBSITE_SUCCESS', payload: website }),
        generateWebsiteError: (error) => dispatch({ type: 'GENERATE_WEBSITE_ERROR', payload: error }),
        deploymentStart: () => dispatch({ type: 'DEPLOYMENT_START' }),
        deploymentSuccess: (data) => dispatch({ type: 'DEPLOYMENT_SUCCESS', payload: data }),
        deploymentError: (error) => dispatch({ type: 'DEPLOYMENT_ERROR', payload: error }),
        resetGenerator: () => dispatch({ type: 'RESET_GENERATOR' }),
        goBack: (step) => dispatch({ type: 'GO_BACK', payload: step }),
        generateWebsite,
        deployWebsite
    };

    return (
        <AppContext.Provider value={{ state, actions }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
