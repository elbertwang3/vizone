import operator,sys
from datetime import datetime
import csv
from time import time


#init(dict count_mat) takes in an empty dictionary
#and initializes every (day,hour) pair to zero
def init(count_mat):
    count_mat = {} #dictionary mapping tuples (day, hour) to counts of crime
    for day in range(7): #days of week
    	for h in range(24): #hours of day
    		count_mat[(day+1, h+1)] = 0
    return count_mat

def count_crime(data, count_mat):
    """This method parses crime dataset and derives the count of crime
    sent at various day,hour pairs.
    Input: file containing crime data in CSV format.
    Hint : Use the Python datetime module 
    """
    # TODO : Fill in count_mat
    reader = csv.reader(data)
    reader.next()
    for row in reader:
        # TODO : CODE HERE
        currDate = row[2]
        #print currDate
        datetimeobject =  datetime.strptime(currDate, "%m/%d/%Y %I:%M:%S %p")
        weekday = datetimeobject.weekday()
        hour = datetimeobject.hour
        count_mat[(weekday+1,hour+1)] += 1
    for key, value in count_mat.iteritems():
        print key, value


    return count_mat


def main():
    data = open(sys.argv[1], 'r') 
    count_mat = init({})
    #print count_mat
    count_mat = count_crime(data, count_mat)

    out = open(sys.argv[2], 'w')
    out.write("day\thour\tvalue\n")
    
    #sort by day, hour (ascending)
    sorted_counts = sorted(count_mat.items(), key=operator.itemgetter(0))
    for (x, y) in sorted_counts:
        out.write(str(x[0])+"\t"+str(x[1])+'\t'+str(y)+"\n")
    out.close()

if __name__ == '__main__':
    main()