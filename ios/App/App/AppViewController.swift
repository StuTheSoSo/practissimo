import Capacitor
import UIKit

class AppViewController: CAPBridgeViewController {
    private var didDisableZoom = false

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        guard !didDisableZoom else { return }
        didDisableZoom = true

        guard let webView = bridge?.webView else { return }
        webView.scrollView.minimumZoomScale = 1.0
        webView.scrollView.maximumZoomScale = 1.0
        webView.scrollView.bouncesZoom = false
        webView.scrollView.pinchGestureRecognizer?.isEnabled = false
    }
}

