import numpy as np
import scipy.optimize as opt
import math

def equation(r, costeta):
    return np.exp(-5 * r/2) * 125 * r ** 3 * (5* costeta ** 3 - 3 * costeta) - 1

# Generate 50 evenly spaced values for z
costeta_values = np.linspace(0, -math.sqrt(0.6), 50)
costeta_values = costeta_values[1:]
pairs = []
str_pairs = ""

r_initial_guess = 1.0
#r_initial_guess = 5.0
for costeta in costeta_values:
    # Use a numerical solver to find x
    try:
        # Initial guess for costeta
        r_solution = opt.fsolve(equation, r_initial_guess, args=(costeta,))
        if abs(equation(r_solution[0], costeta)) < 0.0001:
                pairs.append((round(r_solution[0] * costeta, 4), round(r_solution[0] * math.sqrt(1 - costeta**2), 4)))
                str_pairs = "[" + str(round(r_solution[0] * math.sqrt(1 - costeta**2), 4)) + "," + str(round(r_solution[0] * costeta, 4)) + "]," + str_pairs
                r_initial_guess = r_solution[0]
                print(r_initial_guess)
    except Exception as e:
        print("Failed to solve")

str_pairs = str_pairs[:-1]

print(str_pairs)