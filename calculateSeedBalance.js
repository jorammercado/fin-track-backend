
const seedTransactions = [
    ['deposit', 5000.00, 'checking'],
    ['deposit', 3000.00, 'savings'],
    ['deposit', 2500.00, 'investment'],
    ['income', 3000.00, 'salary'],
    ['income', 200.00, 'rental income'],
    ['income', 150.00, 'bonus'],
    ['income', 50.00, 'interest'],
    ['income', 100.00, 'dividend'],
    ['expense', 1000.00, 'rent/mortgage'],
    ['expense', 300.00, 'groceries'],
    ['expense', 150.00, 'utilities'],
    ['expense', 80.00, 'healthcare'],
    ['expense', 60.00, 'clothing'],
    ['expense', 50.00, 'entertainment'],
    ['expense', 200.00, 'transportation'],
    ['expense', 120.00, 'subscriptions'],
    ['expense', 40.00, 'dining'],
    ['expense', 30.00, 'household supplies'],
    ['investment', 500.00, 'retirement'],
    ['investment', 300.00, 'savings'],
    ['investment', 200.00, 'investment'],
    ['investment', 100.00, 'emergency fund'],
    ['income', 180.00, 'bonus'],
    ['expense', 90.00, 'education'],
    ['investment', 250.00, 'investment'],
    ['expense', 70.00, 'entertainment'],
    ['income', 75.00, 'interest'],
    ['expense', 400.00, 'rent/mortgage'],
    ['expense', 25.00, 'charity'],
    ['expense', 45.00, 'travel'],
    ['investment', 600.00, 'retirement'],
    ['income', 300.00, 'business income'],
    ['expense', 220.00, 'utilities'],
    ['expense', 90.00, 'subscriptions'],
    ['income', 500.00, 'salary'],
    ['expense', 35.00, 'dining'],
    ['investment', 400.00, 'investment'],
    ['expense', 180.00, 'education'],
    ['expense', 50.00, 'groceries'],
    ['income', 90.00, 'interest'],
    ['expense', 300.00, 'transportation'],
    ['investment', 150.00, 'investment'],
    ['expense', 120.00, 'clothing'],
    ['expense', 75.00, 'entertainment'],
    ['expense', 400.00, 'rent/mortgage'],
    ['income', 60.00, 'dividend'],
    ['expense', 200.00, 'household supplies'],
    ['expense', 100.00, 'healthcare'],
    ['investment', 250.00, 'savings'],
    ['income', 90.00, 'bonus'],
    ['expense', 15.00, 'travel'],
    ['investment', 700.00, 'retirement'],
    ['expense', 300.00, 'education'],
    ['expense', 80.00, 'subscriptions'],
    ['income', 100.00, 'interest'],
    ['expense', 500.00, 'rent/mortgage'],
    ['expense', 55.00, 'dining'],
    ['investment', 350.00, 'investment'],
    ['expense', 40.00, 'travel'],
    ['expense', 25.00, 'charity'],
    ['expense', 400.00, 'education'],
    ['expense', 200.00, 'healthcare'],
    ['income', 150.00, 'business income'],
    ['expense', 75.00, 'clothing'],
    ['expense', 85.00, 'entertainment'],
    ['income', 300.00, 'rental income'],
    ['expense', 25.00, 'groceries'],
    ['expense', 65.00, 'subscriptions'],
    ['investment', 500.00, 'investment'],
    ['expense', 120.00, 'dining'],
    ['expense', 400.00, 'rent/mortgage'],
    ['income', 250.00, 'dividend'],
    ['expense', 90.00, 'household supplies'],
    ['expense', 70.00, 'healthcare'],
    ['income', 450.00, 'salary'],
    ['investment', 150.00, 'retirement'],
    ['expense', 30.00, 'education'],
    ['expense', 200.00, 'travel'],
    ['investment', 1000.00, 'savings'],
    ['expense', 150.00, 'transportation'],
    ['expense', 35.00, 'dining'],
    ['income', 60.00, 'bonus'],
    ['expense', 180.00, 'utilities'],
    ['expense', 300.00, 'household supplies'],
    ['income', 75.00, 'interest'],
    ['investment', 250.00, 'investment'],
    ['expense', 400.00, 'rent/mortgage'],
    ['expense', 55.00, 'clothing'],
    ['expense', 65.00, 'travel'],
    ['expense', 200.00, 'utilities'],
    ['expense', 20.00, 'charity'],
    ['expense', 350.00, 'education'],
    ['income', 500.00, 'salary'],
    ['investment', 200.00, 'investment'],
    ['expense', 50.00, 'entertainment'],
    ['expense', 40.00, 'dining'],
    ['income', 250.00, 'bonus'],
    ['income', 500.00, 'rental income'],
    ['income', 120.00, 'interest'],
    ['income', 400.00, 'business income'],
    ['income', 220.00, 'dividend'],
    ['expense', 150.00, 'groceries'],
    ['expense', 300.00, 'rent/mortgage'],
    ['expense', 250.00, 'transportation'],
    ['expense', 200.00, 'education'],
    ['expense', 75.00, 'entertainment'],
    ['expense', 65.00, 'clothing'],
    ['expense', 110.00, 'healthcare'],
    ['expense', 50.00, 'subscriptions'],
    ['expense', 30.00, 'household supplies'],
    ['expense', 40.00, 'charity'],
    ['expense', 100.00, 'travel'],
    ['expense', 250.00, 'rent/mortgage'],
    ['investment', 450.00, 'investment'],
    ['investment', 500.00, 'retirement'],
    ['investment', 300.00, 'savings'],
    ['investment', 350.00, 'investment'],
    ['investment', 150.00, 'savings'],
    ['investment', 250.00, 'retirement'],
    ['investment', 100.00, 'investment'],
    ['income', 200.00, 'bonus'],
    ['expense', 45.00, 'travel'],
    ['expense', 30.00, 'dining'],
    ['expense', 100.00, 'groceries'],
    ['expense', 25.00, 'household supplies'],
    ['income', 150.00, 'dividend'],
    ['expense', 80.00, 'subscriptions'],
    ['expense', 35.00, 'healthcare'],
    ['investment', 300.00, 'investment'],
    ['income', 500.00, 'business income'],
    ['expense', 70.00, 'clothing'],
    ['expense', 150.00, 'education']
]

let checkingAccount = 0
let savingsAccount = 0
let investments = 0

const calculateBalances = (transactions) => {
    transactions.forEach(transaction => {
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