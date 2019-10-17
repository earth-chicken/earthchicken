import sys, json

def main():
    str = sys.argv[1]
    spots = json.loads(str)

    sets = {}

    for s in spots:
      tmp = [s['lon'],s['lat']]

      try:
        sets[s['t']]
        if_exist = True
      except:
        if_exist = False
      if if_exist:
        sets[s['t']] += [tmp]
      else:
        sets[s['t']] = [tmp]





    print(sets)






if __name__ == "__main__":
    main()
