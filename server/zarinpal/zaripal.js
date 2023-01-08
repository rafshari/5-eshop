import ZarinPalCheckout from 'zarinpal-checkout'
/**
 * Create ZarinPal
 * @param {String} `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` [Merchant ID]
 * @param {Boolean} false [toggle `Sandbox` mode]
 */
 const zarinpal = ZarinpalCheckout.create('4ced0a1e-4ad8-4309-9668-3ea3ae8e8897', false);

 export {zarinpal}

