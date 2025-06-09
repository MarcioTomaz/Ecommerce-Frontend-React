// src/i18n.js

import i18next from "i18next";
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


i18next
.use(Backend)
.use(LanguageDetector)
.use(initReactI18next)
.init({
    fallbackLng: 'pt-BR',
    debug: false,

    backend:{
        loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    interpolation: {
        escapeValue: false,
    },

    ns: ['common'],
    defaultNS: 'common',
})