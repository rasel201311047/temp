// components/VoiceSelector.tsx
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import TTSService from '../services/ttsService';

const VoiceSelector = ({ visible, onClose }) => {
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  useEffect(() => {
    const loadVoices = async () => {
      const availableVoices = await TTSService.getAvailableVoices();
      setVoices(availableVoices);
    };
    
    if (visible) {
      loadVoices();
    }
  }, [visible]);

  const selectVoice = async (voice: any) => {
    await TTSService.changeVoice(voice.id);
    setSelectedVoice(voice.id);
    // Play a sample of the voice
    TTSService.setVerses([{ text: 'This is how I sound', verse: 1 }]);
    TTSService.setCurrentVerseIndex(0);
    TTSService.speakCurrentVerse();
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', maxHeight: '80%' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Select Male Voice</Text>
          
          <ScrollView style={{ maxHeight: 300 }}>
            {voices.map(voice => (
              <TouchableOpacity
                key={voice.id}
                onPress={() => selectVoice(voice)}
                style={{
                  padding: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                  backgroundColor: selectedVoice === voice.id ? '#e0e0e0' : 'white',
                }}
              >
                <Text>{voice.name} ({voice.language})</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>
                  {voice.gender} • {voice.quality || 'Standard'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {voices.length === 0 && (
            <Text style={{ padding: 15, textAlign: 'center' }}>
              No male voices found. Using default system voice.
            </Text>
          )}
          
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20, padding: 10, alignItems: 'center' }}>
            <Text style={{ color: 'blue' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VoiceSelector;