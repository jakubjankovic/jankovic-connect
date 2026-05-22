package com.jankovicconnect

import android.content.Intent
import android.provider.ContactsContract
import android.provider.ContactsContract.CommonDataKinds.Email
import android.provider.ContactsContract.CommonDataKinds.Phone
import android.provider.ContactsContract.CommonDataKinds.Website
import android.provider.ContactsContract.Intents.Insert
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import java.io.File

/**
 * Opens the native Android "insert contact" screen prefilled with the
 * provided data. Uses ACTION_INSERT, which does NOT require the
 * WRITE_CONTACTS runtime permission — the user confirms the save.
 */
class ContactModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ContactModule"

    @ReactMethod
    fun openInsertContact(contact: ReadableMap, promise: Promise) {
        try {
            val intent = Intent(Intent.ACTION_INSERT).apply {
                type = ContactsContract.Contacts.CONTENT_TYPE
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                putExtra(Insert.NAME, contact.getStringSafe("name"))
                putExtra(Insert.PHONE, contact.getStringSafe("phone"))
                putExtra(Insert.PHONE_TYPE, Phone.TYPE_MOBILE)
                putExtra(Insert.EMAIL, contact.getStringSafe("email"))
                putExtra(Insert.EMAIL_TYPE, Email.TYPE_HOME)
                putExtra(Insert.NOTES, contact.getStringSafe("notes"))

                // Company (secondary) phone + email
                val phoneCompany = contact.getStringSafe("phoneCompany")
                if (phoneCompany.isNotEmpty()) {
                    putExtra(Insert.SECONDARY_PHONE, phoneCompany)
                    putExtra(Insert.SECONDARY_PHONE_TYPE, Phone.TYPE_WORK)
                }
                val emailCompany = contact.getStringSafe("emailCompany")
                if (emailCompany.isNotEmpty()) {
                    putExtra(Insert.SECONDARY_EMAIL, emailCompany)
                    putExtra(Insert.SECONDARY_EMAIL_TYPE, Email.TYPE_WORK)
                }

                val website = contact.getStringSafe("website")
                if (website.isNotEmpty()) {
                    val websiteRow = android.content.ContentValues().apply {
                        put(
                            ContactsContract.Data.MIMETYPE,
                            Website.CONTENT_ITEM_TYPE,
                        )
                        put(Website.URL, website)
                    }
                    putParcelableArrayListExtra(
                        Insert.DATA,
                        arrayListOf(websiteRow),
                    )
                }
            }

            val activity = currentActivity
            if (activity != null) {
                activity.startActivity(intent)
            } else {
                reactContext.startActivity(intent)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CONTACT_INSERT_ERROR", e.message, e)
        }
    }

    /**
     * Writes a vCard (which may contain an embedded photo) to a cache file and
     * opens it with the Contacts app, which imports the contact — including the
     * photo — without needing the WRITE_CONTACTS permission.
     */
    @ReactMethod
    fun importVCard(vcard: String, promise: Promise) {
        try {
            val file = File(reactContext.cacheDir, "jankovic-contact.vcf")
            file.writeText(vcard)
            val uri = FileProvider.getUriForFile(
                reactContext,
                reactContext.packageName + ".fileprovider",
                file,
            )
            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, "text/x-vcard")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            (currentActivity ?: reactContext).startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("VCARD_IMPORT_ERROR", e.message, e)
        }
    }

    private fun ReadableMap.getStringSafe(key: String): String =
        if (hasKey(key) && !isNull(key)) getString(key) ?: "" else ""
}
