import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const useFontSettings = () => {
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState('sans');

    useEffect(() => {
        loadFontSettings();
    }, []);

    const loadFontSettings = async () => {
        try {
            const savedFontSize = await AsyncStorage.getItem('fontSize');
            const savedFontFamily = await AsyncStorage.getItem('fontFamily');
            
            if (savedFontSize) {
                setFontSize(parseInt(savedFontSize, 10));
            }
            
            if (savedFontFamily) {
                setFontFamily(savedFontFamily);
            }
        } catch (error) {
            console.error('Error loading font settings:', error);
        }
    };

    return { fontSize, fontFamily };
};