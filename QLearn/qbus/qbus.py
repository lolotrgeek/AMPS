'''
@author Lolotrgeek

Creation date: 10/07/2017

Summary: buspy for qlearner to operate in gridlabd simulation.

Usage:
    nosetests test.py:loadBus.<test_case>

Test cases:
    local
    remote

    gridlabd IEEE_8500.glm -D pauseat="2000-09-01 00:00:00" --server --verbose -P 51003
'''

#######################################################################################
# Imports
#######################################################################################

from unittest import TestCase

from buspy.bus import open_bus
from buspy.bus import load_bus
from buspy.comm.message import CommonParam
from buspy.comm.message import MessageCommonData

from numpy import random

#######################################################################################
# Utility Functions
#######################################################################################

def out_to_string(o):
    '''
    Takes the output from a bus.transaction and returns a formatted string.
    '''
    NAME = 'SX2673305B_1_house'
    PARAM = 'air_temperature'
    return '[%s] %s.%s=%s' % (str(o.time),NAME,PARAM,str(o.get_param(NAME,PARAM).value))

def message_gld_input():
    '''
    Randomly assigns a kW power rating to the GridLAB-D house load.
    '''
    NAME = 'SX2673305B_1_waterheater'
    PARAM = 'temperature'
    
    transfer = MessageCommonData()
    
    transfer.add_param(CommonParam(name=NAME,param=PARAM,value=abs(random.normal(80.0,10.0))))
    
    return transfer

#######################################################################################
# Unit Test Class
#######################################################################################

class loadBus(TestCase):

    def local(self):
        '''
        Example using a GridlabBus. Will change the base_power for the load
        at each timestep. Will then query the network_node power.
        '''
        FILENAME = 'local_params.json'
        
        with open_bus(FILENAME) as bus:
            while not bus.finished:
                __out = bus.transaction(inputs=message_gld_input())
                print out_to_string(__out)
    
        print 'bus finished'

    def remote(self):
        '''
        Example using a GridlabBus with a remote GLD. Will change the base_power for the load 
        at each timestep. Will then query the network_node power.
        '''
        FILENAME = 'remote_params.json'
        
        with open_bus(FILENAME) as bus:
            while not bus.finished:
                __out = bus.transaction(inputs=message_gld_input())
                print out_to_string(__out)
    
        print 'bus finished'
        