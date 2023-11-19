import React, { useState } from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isPhotosDropdownOpen, setIsPhotosDropdownOpen] = useState(false);
  const [isMaterialsDropdownOpen, setIsMaterialsDropdownOpen] = useState(false);

  const togglePhotosDropdown = () => {
    setIsPhotosDropdownOpen(!isPhotosDropdownOpen);
    setIsMaterialsDropdownOpen(false);
  };

  const toggleMaterialsDropdown = () => {
    setIsMaterialsDropdownOpen(!isMaterialsDropdownOpen);
    setIsPhotosDropdownOpen(false);
  };

  return (
     <CDBSidebar backgroundColor="rgb(0 0 0)" textColor="#fff" >
        {/* <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
        </CDBSidebarHeader> */}
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu style={{ backgroundColor: "black", color: "white" }}>
            <NavLink exact to="/dashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="cube" >DASHBOARD</CDBSidebarMenuItem>
            </NavLink>
            
            <NavLink activeClassName="activeClicked">
            <CDBSidebarMenuItem onClick={togglePhotosDropdown} icon="image">
              PHOTOS
            </CDBSidebarMenuItem>
            {isPhotosDropdownOpen && (
              <div style={{ paddingLeft: '20px', marginTop: '10px' }}>

                <NavLink exact to="/admin/photos" activeClassName="activeClicked">
                  <CDBSidebarMenuItem icon="list-alt">PHOTOS LIST</CDBSidebarMenuItem>
                </NavLink>

                <NavLink exact to="/admin/photo/new" target="_blank" activeClassName="activeClicked">
                  <CDBSidebarMenuItem icon="plus">CREATE</CDBSidebarMenuItem>
                </NavLink>

              </div>
            )}
          </NavLink>

          <NavLink activeClassName="activeClicked">
            <CDBSidebarMenuItem onClick={toggleMaterialsDropdown} icon="image">
              MATERIALS
            </CDBSidebarMenuItem>
            {isMaterialsDropdownOpen && (
              <div style={{ paddingLeft: '20px', marginTop: '10px' }}>

                <NavLink exact to="/admin/materials" activeClassName="activeClicked">
                  <CDBSidebarMenuItem icon="list-alt">MATERIALS LIST</CDBSidebarMenuItem>
                </NavLink>

                <NavLink exact to="/admin/material" target="_blank" activeClassName="activeClicked">
                  <CDBSidebarMenuItem icon="plus">CREATE</CDBSidebarMenuItem>
                </NavLink>

              </div>
            )}
          </NavLink>
        
            {/* <NavLink exact to="/admin/materials" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="toolbox">MATERIALS</CDBSidebarMenuItem>
            </NavLink> */}
            
            <NavLink exact to="/admin/orders" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="shopping-cart">ORDERS</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/admin/users" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">USERS</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/admin/reviews" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="star">REVIEWS</CDBSidebarMenuItem>
            </NavLink>

            {/* <CDBSidebarFooter style={{ textAlign: 'center' }}>
            <div>© 2023 Photocard Shop</div>
          </CDBSidebarFooter> */}
          </CDBSidebarMenu>
        </CDBSidebarContent> 
      </CDBSidebar>
  );
};

export default Sidebar;