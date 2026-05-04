When I click the logout button, the following error appear:
[browser] Failed to fetch RSC payload for http://localhost:3000/. Falling back to browser navigation. TypeError: Failed to fetch
at n (chrome-extension://mdnleldcmiljblolnjhpnblkcekpdkpa/page-scripts/ajaxRequestInterceptor.ps.js:1:12912)
at fetch (chrome-extension://mdnleldcmiljblolnjhpnblkcekpdkpa/page-scripts/ajaxRequestInterceptor.ps.js:1:13985)

Sometimes, when we login, we get redirected to this weird long URL, which doesn't show anything on the page:
https://select-filly-87.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F
