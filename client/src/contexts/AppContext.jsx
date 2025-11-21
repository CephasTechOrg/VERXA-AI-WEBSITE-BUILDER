import React, { createContext, useContext, useReducer } from 'react'
import { websiteAPI } from '../services/api'

const AppContext = createContext()

const initialState = {
    websiteType: null,
    userData: {},
    colorScheme: 'modern-blue',
    generatedWebsite: null,
    loading: false,
    step: 'home',
    error: null,
    uploadedAssets: []
}

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_WEBSITE_TYPE':
            return {
                ...state,
                websiteType: action.payload,
                step: 'generator',
                error: null
            }

        case 'UPDATE_USER_DATA':
            return {
                ...state,
                userData: { ...state.userData, ...action.payload }
            }

        case 'SET_COLOR_SCHEME':
            return {
                ...state,
                colorScheme: action.payload
            }

        case 'GENERATE_WEBSITE_START':
            return {
                ...state,
                loading: true,
                error: null
            }

        case 'GENERATE_WEBSITE_SUCCESS':
            return {
                ...state,
                loading: false,
                generatedWebsite: action.payload,
                step: 'preview'
            }

        case 'GENERATE_WEBSITE_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case 'RESET_GENERATOR':
            return {
                ...initialState
            }

        case 'REGISTER_ASSET':
            return {
                ...state,
                uploadedAssets: [...state.uploadedAssets, action.payload]
            }

        case 'GO_BACK':
            return {
                ...state,
                step: action.payload,
                error: null
            }

        default:
            return state
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState)

    const generateWebsite = async (websiteType, userData, colorScheme, uploadedAssets = []) => {
        try {
            console.log('Generating website request...')
            const response = await websiteAPI.generate({
                websiteType,
                userData,
                colorScheme,
                uploadedAssets
            })
            console.log('Received response:', response)
            return response
        } catch (error) {
            console.error('API Error:', error)
            throw new Error(error.message || 'Failed to generate website')
        }
    }

    const actions = {
        setWebsiteType: (type) => dispatch({ type: 'SET_WEBSITE_TYPE', payload: type }),
        updateUserData: (data) => dispatch({ type: 'UPDATE_USER_DATA', payload: data }),
        setColorScheme: (scheme) => dispatch({ type: 'SET_COLOR_SCHEME', payload: scheme }),
        generateWebsiteStart: () => dispatch({ type: 'GENERATE_WEBSITE_START' }),
        generateWebsiteSuccess: (website) => dispatch({ type: 'GENERATE_WEBSITE_SUCCESS', payload: website }),
        generateWebsiteError: (error) => dispatch({ type: 'GENERATE_WEBSITE_ERROR', payload: error }),
        registerAsset: (asset) => dispatch({ type: 'REGISTER_ASSET', payload: asset }),
        resetGenerator: () => dispatch({ type: 'RESET_GENERATOR' }),
        goBack: (step) => dispatch({ type: 'GO_BACK', payload: step }),
        generateWebsite
    }

    return (
        <AppContext.Provider value={{ state, actions }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
