import {Alert, Linking, NativeModules, Platform} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {BOOKING_LINK, PROFILE, PUBLIC_CARD_URL} from '../constants/profile';

const {ContactModule} = NativeModules as {
  ContactModule?: {
    openInsertContact: (contact: {
      name: string;
      phone: string;
      email: string;
      phoneCompany: string;
      emailCompany: string;
      website: string;
      title: string;
      notes: string;
    }) => Promise<boolean>;
  };
};

async function openUrl(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch (e) {
    Alert.alert('Nepodarilo sa otvoriť', url);
  }
}

export const openLinkedIn = () => openUrl(PROFILE.linkedin);
export const openFacebook = () => openUrl(PROFILE.facebook);
export const openEmail = () => openUrl(`mailto:${PROFILE.email}`);
export const callPhone = () => openUrl(`tel:${PROFILE.phoneDial}`);
export const openBooking = () => openUrl(BOOKING_LINK);

export const copyEmail = (): void => {
  Clipboard.setString(PROFILE.email);
};

export const copyCardLink = (): void => {
  Clipboard.setString(PUBLIC_CARD_URL);
};

/**
 * Opens the native Android "insert contact" screen prefilled with the
 * profile data. Uses a native module that fires ACTION_INSERT, so no
 * runtime contact-write permission is required.
 */
export const saveContact = async (): Promise<void> => {
  const notes = `LinkedIn: ${PROFILE.linkedin}\nFacebook: ${PROFILE.facebook}`;
  if (Platform.OS === 'android' && ContactModule?.openInsertContact) {
    try {
      await ContactModule.openInsertContact({
        name: PROFILE.fullName,
        phone: PROFILE.phone,
        email: PROFILE.email,
        phoneCompany: PROFILE.phoneCompany,
        emailCompany: PROFILE.emailCompany,
        website: PROFILE.website,
        title: PROFILE.headline,
        notes,
      });
      return;
    } catch (e) {
      Alert.alert('Kontakt sa nepodarilo otvoriť', String(e));
      return;
    }
  }
  Alert.alert('Nedostupné', 'Ukladanie kontaktu je dostupné iba na Androide.');
};
