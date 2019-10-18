# Read in NetCDF4 file (Assign directory path if necessary):

from netCDF4 import Dataset
data = Dataset('MERRA2_300.tavgM_2d_slv_Nx.201001.nc4', mode='r')

# Run the following line below to print MERRA-2 metadata. This line will print attribute and variable information. From the 'variables(dimensions)' list, choose which variable(s) to read in below.
print(data)

# Read in the 'T2M' 2-meter air temperature variable:
lons = data.variables['lon'][:]
lats = data.variables['lat'][:]
T2M = data.variables['T2M'][:,:,:]

# If using MERRA-2 data with multiple time indices, the following line will subset the first time dimension. Note: Changing T2M[0,:,:] to T2M[10,:,:] will subset to the 11th time index.

T2M = T2M[0,:,:]

 

#Start Plotting Data

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from mpl_toolkits.basemap import Basemap

# Map the data onto the base map and add features:

map = Basemap(resolution='l', projection='eck4', lat_0=0, lon_0=0)

lon, lat = np.meshgrid(lons, lats)
xi, yi = map(lon, lat)

# Plot data:
cs = map.pcolor(xi,yi,np.squeeze(T2M), vmin=np.min(T2M), vmax=np.max(T2M), cmap=cm.jet)
cs.set_edgecolor('face')

# Add grid lines:
map.drawparallels(np.arange(-90., 90., 15.), labels=[1,0,0,0], fontsize=5)
map.drawmeridians(np.arange(-180., 180., 30.), labels=[0,0,0,1], fontsize=4)

# Add coastlines, states, and county boundaries:
map.drawcoastlines()
map.drawstates()
map.drawcountries()

# Add colorbar:
cbar = map.colorbar(cs, location='bottom', pad="10%")
cbar.set_label('K')
cbar.ax.tick_params(labelsize=10)

# Add title:
plt.title('MERRA-2 2-meter air temperature (2010-01)')

figure = plt.figure(1)

# Save the figures as a PDF:
figure.savefig('MERRA2_2m_airTemp_TEST.pdf', format='pdf', dpi=360)
