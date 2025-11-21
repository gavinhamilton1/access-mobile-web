import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import { Button, FlexLayout, StackLayout, Text } from '@salt-ds/core';
import { useHistory } from 'react-router-dom';
import { ArrowBack, Check, Search, Warning } from '../components/icons';
import { captureHistoryData, type CaptureHistoryItem } from '../data/captureHistoryData';
import './home.css';

import {
  Filter,
} from '../components/icons';

const CaptureHistory: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');

  const filteredData = captureHistoryData.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.programNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBack = () => history.goBack();

  const statusConfig: Record<CaptureHistoryItem['status'], { label: string; icon: React.ReactNode }> = {
    'action-required': {
      label: 'Action Required',
      icon: <Warning size={16} className="salt-inline-icon" color="var(--salt-status-warning-foreground)" />,
    },
    deposited: {
      label: 'Deposited',
      icon: <Check size={16} className="salt-inline-icon" color="var(--salt-status-success-foreground)" />,
    },
  };

  return (
    <IonPage>
      <IonHeader translucent={false}>
        <IonToolbar className="salt-toolbar">
          <StackLayout gap={1} className="salt-toolbar-content">
            <div className="salt-toolbar-3column">
              <div className="salt-toolbar-column-left">
                <Button
                  appearance="transparent"
                  sentiment="neutral"
                  onClick={handleBack}
                  style={{ padding: `0 var(--salt-spacing-100)` }}
                >
                  <ArrowBack size={18} className="salt-inline-icon" />
                </Button>
              </div>
              <div className="salt-toolbar-column-center">
                <Text styleAs="h4" className="salt-toolbar-title">
                  Capture history
                </Text>
              </div>
              <div className="salt-toolbar-column-right">

              </div>
            </div>

            <FlexLayout align="center" gap={1} style={{ width: '100%', padding: 'var(--salt-spacing-50)' }}>
              <FlexLayout align="center" gap={1} className="salt-search-input">
                <Search size={20} className="salt-icon-subtle salt-inline-icon" />
                <input
                  type="search"
                  value={searchText}
                  placeholder="Search history"
                  onChange={e => setSearchText(e.target.value)}
                />
              </FlexLayout>
              <Button
                appearance="bordered"
                sentiment="neutral"
                aria-label="Filter"
                className="salt-filter-button"
              >
                <Filter size={20} className="salt-filter-icon salt-inline-icon" />
              </Button>
            </FlexLayout>

          </StackLayout>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="salt-page-shell">
          <StackLayout className="salt-page-content-wide" gap={1}>

            <StackLayout gap={0} className="salt-list">
              {filteredData.map(item => {
                const status = statusConfig[item.status];
                return (
                  <div key={item.id} className="salt-list-item">
                    <FlexLayout align="start" justify="space-between" className="salt-list-item-content" gap={2}>
                      <StackLayout gap={0.2} style={{ flex: 1, minWidth: 0 }}>
                        <Text styleAs="h4" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </Text>
                        <Text styleAs="label">{item.programNumber}</Text>
                      </StackLayout>
                      <StackLayout gap={0.5} align="end">
                        <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)'}}>
                          {item.date}
                        </Text>
                        <Text styleAs="label">
                          {item.currency} {item.amount}
                        </Text>
                        <FlexLayout align="center" gap={1}>
                          {status.icon}
                          <Text 
                            styleAs="label" 
                            style={{ 
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: item.status === 'action-required'
                                ? 'var(--salt-status-warning-foreground)'
                                : 'var(--salt-status-success-foreground)',
                            }}
                          >
                            {status.label}
                          </Text>
                        </FlexLayout>
                      </StackLayout>
                    </FlexLayout>
                  </div>
                );
              })}

              {filteredData.length === 0 && (
                <div className="salt-list-item">
                  <div className="salt-list-item-content" style={{ padding: 'var(--salt-spacing-300)', textAlign: 'center' }}>
                    <Text styleAs="label" style={{ color: 'var(--salt-content-secondary-foreground)' }}>
                      No capture history matches your search.
                    </Text>
                  </div>
                </div>
              )}
            </StackLayout>
          </StackLayout>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CaptureHistory;
