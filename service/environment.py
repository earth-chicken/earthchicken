import sys, json
from netCDF4 import Dataset
from scipy import interpolate
import numpy as np
import mysql.connector

data_path = './data/NASA/'
mysql_config = 0

try:
  with open('./certs/mysql_config.true.json') as json_file:
    mysql_config = json.loads(json_file.read())
except FileNotFoundError:
  print('Server MySQL config not found, use Raspberry Pi MySQL instead ...')
  with open('./certs/mysql_config.rasp.json') as json_file:
    mysql_config = json.loads(json_file.read())



def main():

    mysql_database = mysql.connector.connect(
      host = mysql_config['host'],
      user = mysql_config['user'],
      password = mysql_config['password'],
      database = mysql_config['database'],
      )
    cursor = mysql_database.cursor()

    str = sys.argv[1]
    alls = json.loads(str)

    for spots in alls:
      date = spots[0]['t']
      filename = data_path + 'GLDAS_NOAH025_M.A'+date+'.021.nc4'
      try:
        data = Dataset(filename, mode='r')
      except FileNotFoundError:
        print('NASA database not found at: ' + data_path)
        print('Environment auto update is disabled ...')
        return

      lons = data.variables['lon'][:]
      lats = data.variables['lat'][:]
      temp = data.variables['Tair_f_inst'][0,:,:]
      rain = data.variables['Rainf_f_tavg'][0,:,:]
      moist = data.variables['SoilMoi0_10cm_inst'][0,:,:]

#      for l in moist:
#        print (l)


      nx = len(lons)
      lon_ind = [i for i in range(nx)]
      ny = len(lats)
      lat_ind = [i for i in range(ny)]

      set_lon = []
      set_lat = []



      for set in spots:
        set_lon.append(set['lon']/10.)
        set_lat.append(set['lat']/10.)

      indx = np.interp(set_lon, lons, lon_ind).astype(int)
      indy = np.interp(set_lat, lats, lat_ind).astype(int)

      # times ten for storage
      tt = temp[indy,indx]- 273.15
      rr = rain[indy,indx]

      for set, t in zip(spots,tt):
        uid = set['uid']
        gid = set['gid']
        lon = set['lon']
        lat = set['lat']
        sql_cmd = '''UPDATE lands_%(uid)s SET temperature = %(t)f , updated = NOW() WHERE gid = %(gid)d AND lon = %(lon)d AND lat = %(lat)d ;
        ''' % locals()
        print (sql_cmd)
        cursor.execute(sql_cmd)

    mysql_database.commit()
    cursor.close()
    mysql_database.close()


if __name__ == "__main__":
    main()
