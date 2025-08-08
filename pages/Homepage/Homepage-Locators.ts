export const HomePageLocators = {

    HomeButton: '//i[contains(@class, "fa fa-home")]',
    ProductsButton: '//a[contains(@href, "/products")]',
    CartButton: '//a[contains(@href, "/view_cart")]',
    LoginButton: '//a[contains(@href, "/login")]',
    TestCaseButton: '//a[text()=" Test Cases"]',
    APITestingButton: '//a[contains(@href, "/api_list")]',
    VideoTutorialsButton: '//a[contains(@href, "/video_tutorials")]',
    ContactUsButton: '//a[contains(@href, "/contact_us")]',
    DeleteAccountButton: '//a[contains(@href, "/delete_account")]',
    Logout: '//a[contains(@href, "/logout")]',
    featuredProducts: '//div[@class="features_items"]',
    SubscriptionText: '//h2[contains(text(), "Subscription")]',
    SubscriptionField: '//input[@id="susbscribe_email"]',
    SubscriptionButton: '//button[@id="subscribe"]',
    SubscriptionNotification: 'You have been successfully subscribed!'
};

export const baseValue = {

    AccountDeletedMessage: 'Account Deleted!',
}

// export const SignUpLocators = {

//     email: 'email',
//     password: 'password',
// }