import React from "react";
var ReactScriptLoaderMixin = require("react-script-loader").ReactScriptLoaderMixin;

/**
 * The ES6 extends way doesnot support mixins anymore
 */
var StripeLoader = React.createClass({
  mixins: [ReactScriptLoaderMixin],

  getScriptURL: function() {
    console.log("[StripeLoader] prepare to load js!");
    return "https://js.stripe.com/v2/";
  },

  onScriptLoaded: function() {
    if (!StripeLoader.getStripeToken) {
      // Put your publishable key here
      Stripe.setPublishableKey($("meta[name=stripe_publishable_key]").attr("content"));
      console.log("[StripeLoader] js loaded!");
    }
  },

  onScriptError: function() {
    console.error("[StripeLoader] js failed to load!");
  },

  render: function() {
    return null;
  }
});
module.exports = StripeLoader;
