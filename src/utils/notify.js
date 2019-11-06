import { Notify } from 'quasar'

/* Notify an error (color red)
 * @param header The header message required
 * @param icon   The icon to show required
 * @param msg    Optional sub message with details
 */
export function error (header, icon, msg = null) {
  Notify.create({
    message: msg ? header+': '+msg : header,
    icon: icon
  })
}

/* Notify a success (color green)
 * @param header The header message required
 * @param icon   The icon to show required
 * @param msg    Optional sub message with details
 */
export function success (header, icon, msg = null) {
  Notify.create({
    message: msg ? header+': '+msg : header,
    icon: icon,
    color: 'positive'
  })
}
