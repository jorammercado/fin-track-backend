const seedTransactions = [
    ['deposit', 5000.0, 'checking'],
    ['deposit', 3000.0, 'savings'],
    ['deposit', 2500.0, 'investment'],
    ['income', 3000.0, 'salary'],
    ['income', 200.0, 'rental income'],
    ['income', 150.0, 'bonus'],
    ['income', 50.0, 'interest'],
    ['income', 100.0, 'dividend'],
    ['expense', 1000.0, 'rent/mortgage'],
    ['expense', 300.0, 'groceries'],
    ['expense', 150.0, 'utilities'],
    ['expense', 80.0, 'healthcare'],
    ['expense', 60.0, 'clothing'],
    ['expense', 50.0, 'entertainment'],
    ['expense', 200.0, 'transportation'],
    ['expense', 120.0, 'subscriptions'],
    ['expense', 40.0, 'dining'],
    ['expense', 30.0, 'household supplies'],
    ['investment', 500.0, 'retirement'],
    ['investment', 300.0, 'savings'],
    ['investment', 200.0, 'investment'],
    ['investment', 100.0, 'emergency fund'],
    ['income', 180.0, 'bonus'],
    ['expense', 90.0, 'education'],
    ['investment', 250.0, 'investment'],
    ['expense', 70.0, 'entertainment'],
    ['income', 75.0, 'interest'],
    ['expense', 400.0, 'rent/mortgage'],
    ['expense', 25.0, 'charity'],
    ['expense', 45.0, 'travel'],
    ['investment', 600.0, 'retirement'],
    ['income', 300.0, 'business income'],
    ['expense', 220.0, 'utilities'],
    ['expense', 90.0, 'subscriptions'],
    ['income', 500.0, 'salary'],
    ['expense', 35.0, 'dining'],
    ['investment', 400.0, 'investment'],
    ['expense', 180.0, 'education'],
    ['expense', 50.0, 'groceries'],
    ['income', 90.0, 'interest'],
    ['expense', 300.0, 'transportation'],
    ['investment', 150.0, 'investment'],
    ['expense', 120.0, 'clothing'],
    ['expense', 75.0, 'entertainment'],
    ['expense', 400.0, 'rent/mortgage'],
    ['income', 60.0, 'dividend'],
    ['expense', 200.0, 'household supplies'],
    ['expense', 100.0, 'healthcare'],
    ['investment', 250.0, 'savings'],
    ['income', 90.0, 'bonus'],
    ['expense', 15.0, 'travel'],
    ['investment', 700.0, 'retirement'],
    ['expense', 300.0, 'education'],
    ['expense', 80.0, 'subscriptions'],
    ['income', 100.0, 'interest'],
    ['expense', 500.0, 'rent/mortgage'],
    ['expense', 55.0, 'dining'],
    ['investment', 350.0, 'investment'],
    ['expense', 40.0, 'travel'],
    ['expense', 25.0, 'charity'],
    ['expense', 400.0, 'education'],
    ['expense', 200.0, 'healthcare'],
    ['income', 150.0, 'business income'],
    ['expense', 75.0, 'clothing'],
    ['expense', 85.0, 'entertainment'],
    ['income', 300.0, 'rental income'],
    ['expense', 25.0, 'groceries'],
    ['expense', 65.0, 'subscriptions'],
    ['investment', 500.0, 'investment'],
    ['expense', 120.0, 'dining'],
    ['expense', 400.0, 'rent/mortgage'],
    ['income', 250.0, 'dividend'],
    ['expense', 90.0, 'household supplies'],
    ['expense', 70.0, 'healthcare'],
    ['income', 450.0, 'salary'],
    ['investment', 150.0, 'retirement'],
    ['expense', 30.0, 'education'],
    ['expense', 200.0, 'travel'],
    ['investment', 1000.0, 'savings'],
    ['expense', 150.0, 'transportation'],
    ['expense', 35.0, 'dining'],
    ['income', 60.0, 'bonus'],
    ['expense', 180.0, 'utilities'],
    ['expense', 300.0, 'household supplies'],
    ['income', 75.0, 'interest'],
    ['investment', 250.0, 'investment'],
    ['expense', 400.0, 'rent/mortgage'],
    ['expense', 55.0, 'clothing'],
    ['expense', 65.0, 'travel'],
    ['expense', 200.0, 'utilities'],
    ['expense', 20.0, 'charity'],
    ['expense', 350.0, 'education'],
    ['income', 500.0, 'salary'],
    ['investment', 200.0, 'investment'],
    ['expense', 50.0, 'entertainment'],
    ['expense', 40.0, 'dining'],
    ['income', 250.0, 'bonus'],
    ['income', 500.0, 'rental income'],
    ['income', 120.0, 'interest'],
    ['income', 400.0, 'business income'],
    ['income', 220.0, 'dividend'],
    ['expense', 150.0, 'groceries'],
    ['expense', 300.0, 'rent/mortgage'],
    ['expense', 250.0, 'transportation'],
    ['expense', 200.0, 'education'],
    ['expense', 75.0, 'entertainment'],
    ['expense', 65.0, 'clothing'],
    ['expense', 110.0, 'healthcare'],
    ['expense', 50.0, 'subscriptions'],
    ['expense', 30.0, 'household supplies'],
    ['expense', 40.0, 'charity'],
    ['expense', 100.0, 'travel'],
    ['expense', 250.0, 'rent/mortgage'],
    ['investment', 450.0, 'investment'],
    ['investment', 500.0, 'retirement'],
    ['investment', 300.0, 'savings'],
    ['investment', 350.0, 'investment'],
    ['investment', 150.0, 'savings'],
    ['investment', 250.0, 'retirement'],
    ['investment', 100.0, 'investment'],
    ['income', 200.0, 'bonus'],
    ['expense', 45.0, 'travel'],
    ['expense', 30.0, 'dining'],
    ['expense', 100.0, 'groceries'],
    ['expense', 25.0, 'household supplies'],
    ['income', 150.0, 'dividend'],
    ['expense', 80.0, 'subscriptions'],
    ['expense', 35.0, 'healthcare'],
    ['investment', 300.0, 'investment'],
    ['income', 500.0, 'business income'],
    ['expense', 70.0, 'clothing'],
    ['expense', 150.0, 'education'],
]

let checkingAccount = 0
let savingsAccount = 0
let investments = 0

const calculateBalances = (transactions) => {
    transactions.forEach((transaction) => {
        const [transaction_type, amount, category] = transaction
        let balanceColumn

        if (transaction_type === 'income') {
            balanceColumn = 'checkingAccount'
        } else if (transaction_type === 'expense') {
            balanceColumn = 'checkingAccount'
        } else if (transaction_type === 'investment') {
            if (['retirement', 'savings', 'emergency fund'].includes(category)) {
                balanceColumn = 'savingsAccount'
            } else {
                balanceColumn = 'investments'
            }
        } else if (transaction_type === 'deposit') {
            if (category === 'savings') {
                balanceColumn = 'savingsAccount'
            } else if (category === 'investment') {
                balanceColumn = 'investments'
            } else {
                balanceColumn = 'checkingAccount'
            }
        }

        if (balanceColumn) {
            const updateValue = transaction_type === 'expense' ? -Number(amount) : Number(amount)
            if (balanceColumn === 'checkingAccount') {
                checkingAccount += updateValue
            } else if (balanceColumn === 'savingsAccount') {
                savingsAccount += updateValue
            } else if (balanceColumn === 'investments') {
                investments += updateValue
            }
        }
    })

    console.log(`Final Balances:`)
    console.log(`Checking Account: $${checkingAccount.toFixed(2)}`)
    console.log(`Savings Account: $${savingsAccount.toFixed(2)}`)
    console.log(`Investments: $${investments.toFixed(2)}`)
}

calculateBalances(seedTransactions)
