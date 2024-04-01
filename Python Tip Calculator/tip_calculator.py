# takes a user's input at the command line for:

# Cost of the food
# Number of people splitting the bill
# Percentage of the tip
def tip_calculator():

    print("Welcome to the Tip Calculator")
    #Prompt the user to enter the amount on the bill
    total_bill = float(input("What is the total bill?: "))
    #Prompt the user for the % tip they'd like to leave
    percentage_tip = int(input("What % tip would you like to give?: "))
    #Prompt the user for the # of people splitting the bill
    number_of_people = int(input("How many people are splitting the bill?: "))
    Sales_tax = .10 * total_bill 

    
    print("\n")
    
    #Calculate the value each person owes based on the bill and tips the user entered
  
 
    #Print the $ amount of the tip
    tip_amount = "%.2f" % float(percentage_tip / 100 * total_bill)
    print(f"Tip amount: ${tip_amount}")


    #convert total bill and tip amount to floats so they can be added
    total_bill_float = float(total_bill)
    tip_amount_float = float(tip_amount)
    tip_and_total = (total_bill_float+tip_amount_float+Sales_tax)
    payment_per_person = (tip_and_total/number_of_people)
    print(f"Total bill including tip: ${tip_and_total}")

    #Print what each person needs to pay
    print(f"Each person owes: ${payment_per_person}")
tip_calculator()
# The total bill (including tip)
# How much each person should pay (you can assume all people will split the bill evenly)


# Assume there is a 10% sales tax. Don't forget to add this into the total bill! 

# Note: your tip calculator should be able to handle a bill of any amount of many money, 
# with any number of people splitting the bill, and with any tip percentage (including 0 tip)