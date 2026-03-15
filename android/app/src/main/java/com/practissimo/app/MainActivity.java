package com.practissimo.app;

import android.os.Bundle;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    WebView webView = getBridge() != null ? getBridge().getWebView() : null;
    if (webView != null) {
      webView.getSettings().setSupportZoom(false);
      webView.getSettings().setBuiltInZoomControls(false);
      webView.getSettings().setDisplayZoomControls(false);
    }
  }
}
