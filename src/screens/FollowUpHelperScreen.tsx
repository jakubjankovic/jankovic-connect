import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {colors, font, radius, spacing} from '../constants/theme';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import ActionButton from '../components/ActionButton';
import Disclaimer from '../components/Disclaimer';
import {generateFollowUp} from '../utils/followUp';

interface Field {
  key: 'name' | 'place' | 'topic' | 'nextStep';
  label: string;
  placeholder: string;
  multiline?: boolean;
}

const FIELDS: Field[] = [
  {key: 'name', label: 'Meno osoby', placeholder: 'napr. Pani Nováková'},
  {key: 'place', label: 'Kde sme sa stretli', placeholder: 'napr. networking event v Bratislave'},
  {key: 'topic', label: 'O čom sme sa rozprávali', placeholder: 'napr. kariérny rast a financie', multiline: true},
  {key: 'nextStep', label: 'Ďalší krok', placeholder: 'napr. Pošlem Vám sľúbený článok.', multiline: true},
];

export default function FollowUpHelperScreen() {
  const [values, setValues] = useState({
    name: '',
    place: '',
    topic: '',
    nextStep: '',
  });
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setMessage(generateFollowUp(values));
    setCopied(false);
  };

  const handleCopy = () => {
    if (!message) {
      return;
    }
    Clipboard.setString(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Card>
          <SectionTitle
            title="Správa po stretnutí"
            subtitle="Vygeneruj profesionálnu správu"
          />
          {FIELDS.map(field => (
            <View key={field.key} style={styles.fieldWrap}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={[styles.input, field.multiline && styles.inputMultiline]}
                placeholder={field.placeholder}
                placeholderTextColor={colors.muted}
                value={values[field.key]}
                multiline={field.multiline}
                onChangeText={text =>
                  setValues(prev => ({...prev, [field.key]: text}))
                }
              />
            </View>
          ))}
          <ActionButton
            label="Vygenerovať správu"
            icon="✨"
            variant="primary"
            onPress={handleGenerate}
          />
        </Card>

        {message ? (
          <Card>
            <SectionTitle title="Tvoja správa" />
            <View style={styles.output}>
              <Text style={styles.outputText}>{message}</Text>
            </View>
            <ActionButton
              label="Kopírovať správu"
              icon="📋"
              onPress={handleCopy}
              success={copied}
              successLabel="Skopírované ✓"
            />
          </Card>
        ) : null}

        <Disclaimer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.lg, paddingBottom: spacing.xxl},
  fieldWrap: {marginBottom: spacing.md},
  label: {
    color: colors.muted,
    fontSize: font.small,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: font.body,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  output: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  outputText: {
    color: colors.text,
    fontSize: font.body,
    lineHeight: 23,
  },
});
