/**
 * LoadingStates Component
 * ========================
 * Various loading state components for different use cases
 */

import React from 'react';
import { Spin, Result, Empty, Alert } from 'antd';
import {
  LoadingOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CloudSyncOutlined
} from '@ant-design/icons';
import './LoadingStates.scss';

/**
 * Centered Loading Spinner
 */
export const CenteredLoader = ({
  size = 'default',
  message = 'Loading...',
  tip = null
}) => (
  <div className="centered-loader">
    <Spin
      size={size}
      tip={tip || message}
      indicator={<LoadingOutlined style={{ fontSize: size === 'large' ? 48 : 24 }} spin />}
    />
  </div>
);

/**
 * Inline Loader (for buttons, etc.)
 */
export const InlineLoader = ({ message = 'Loading...', size = 'small' }) => (
  <span className="inline-loader">
    <Spin size={size} /> {message}
  </span>
);

/**
 * Overlay Loader (covers parent element)
 */
export const OverlayLoader = ({
  message = 'Loading...',
  transparent = false
}) => (
  <div className={`overlay-loader ${transparent ? 'transparent' : ''}`}>
    <Spin
      size="large"
      tip={message}
      indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
    />
  </div>
);

/**
 * Saving/Processing State
 */
export const SavingState = ({ message = 'Saving...' }) => (
  <div className="saving-state">
    <SyncOutlined spin style={{ fontSize: 16, marginRight: 8 }} />
    <span>{message}</span>
  </div>
);

/**
 * Syncing State
 */
export const SyncingState = ({ message = 'Syncing...' }) => (
  <div className="syncing-state">
    <CloudSyncOutlined spin style={{ fontSize: 16, marginRight: 8, color: '#1890ff' }} />
    <span>{message}</span>
  </div>
);

/**
 * Processing State with Progress
 */
export const ProcessingState = ({
  message = 'Processing...',
  progress = null
}) => (
  <div className="processing-state">
    <Spin size="default" />
    <div className="processing-text">
      <div>{message}</div>
      {progress !== null && (
        <div className="processing-progress">{progress}%</div>
      )}
    </div>
  </div>
);

/**
 * Empty State with Custom Message
 */
export const EmptyState = ({
  message = 'No data available',
  description = null,
  action = null
}) => (
  <div className="empty-state-container">
    <Empty
      description={
        <div>
          <div className="empty-message">{message}</div>
          {description && <div className="empty-description">{description}</div>}
        </div>
      }
    >
      {action}
    </Empty>
  </div>
);

/**
 * Error State
 */
export const ErrorState = ({
  title = 'Error Loading Data',
  message = 'Something went wrong. Please try again.',
  onRetry = null
}) => (
  <div className="error-state-container">
    <Result
      status="error"
      title={title}
      subTitle={message}
      extra={onRetry ? [
        <button key="retry" onClick={onRetry} className="retry-button">
          Try Again
        </button>
      ] : null}
    />
  </div>
);

/**
 * No Results State (for search/filter)
 */
export const NoResultsState = ({
  query = '',
  onClear = null
}) => (
  <div className="no-results-state">
    <Empty
      description={
        <div>
          <div className="no-results-message">
            No results found {query && `for "${query}"`}
          </div>
          <div className="no-results-description">
            Try adjusting your search or filters
          </div>
        </div>
      }
    >
      {onClear && (
        <button onClick={onClear} className="clear-filters-button">
          Clear Filters
        </button>
      )}
    </Empty>
  </div>
);

/**
 * Timeout State
 */
export const TimeoutState = ({
  message = 'Request timed out',
  onRetry = null
}) => (
  <div className="timeout-state">
    <Result
      icon={<ClockCircleOutlined />}
      title="Request Timeout"
      subTitle={message}
      extra={onRetry ? [
        <button key="retry" onClick={onRetry} className="retry-button">
          Try Again
        </button>
      ] : null}
    />
  </div>
);

/**
 * Loading with Cancel Option
 */
export const CancellableLoader = ({
  message = 'Loading...',
  onCancel = null
}) => (
  <div className="cancellable-loader">
    <Spin size="large" tip={message} />
    {onCancel && (
      <button onClick={onCancel} className="cancel-button">
        Cancel
      </button>
    )}
  </div>
);

/**
 * Loading Alert (banner style)
 */
export const LoadingAlert = ({
  message = 'Loading data...',
  type = 'info',
  closable = false
}) => (
  <Alert
    message={
      <span>
        <Spin size="small" style={{ marginRight: 8 }} />
        {message}
      </span>
    }
    type={type}
    closable={closable}
    className="loading-alert"
  />
);

/**
 * Skeleton Table Rows (for progressive loading)
 */
export const SkeletonTableRows = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <tr key={i} className="skeleton-table-row">
        <td colSpan="100%">
          <div className="skeleton-table-cell">
            <div className="skeleton-line"></div>
          </div>
        </td>
      </tr>
    ))}
  </>
);

/**
 * Button Loading State
 */
export const ButtonLoader = ({ loading = false, children }) => (
  <>
    {loading && <LoadingOutlined style={{ marginRight: 8 }} />}
    {children}
  </>
);

/**
 * Card Loading Overlay
 */
export const CardLoader = ({ loading = false, children }) => (
  <div className={`card-loader-wrapper ${loading ? 'loading' : ''}`}>
    {loading && <OverlayLoader transparent />}
    <div className={loading ? 'content-loading' : ''}>
      {children}
    </div>
  </div>
);

/**
 * Full Page Loading Screen
 */
export const FullPageLoading = ({
  message = 'Loading Application...',
  logo = null
}) => (
  <div className="full-page-loading">
    {logo && <div className="loading-logo">{logo}</div>}
    <Spin
      size="large"
      tip={message}
      indicator={<LoadingOutlined style={{ fontSize: 64 }} spin />}
    />
  </div>
);

/**
 * Lazy Loading Indicator (for infinite scroll)
 */
export const LazyLoadIndicator = ({ message = 'Loading more...' }) => (
  <div className="lazy-load-indicator">
    <Spin size="small" />
    <span className="lazy-load-text">{message}</span>
  </div>
);

/**
 * Refreshing Indicator (subtle, non-blocking)
 */
export const RefreshingIndicator = ({ show = false }) => {
  if (!show) return null;

  return (
    <div className="refreshing-indicator">
      <SyncOutlined spin style={{ fontSize: 14 }} />
      <span>Refreshing...</span>
    </div>
  );
};

export default {
  CenteredLoader,
  InlineLoader,
  OverlayLoader,
  SavingState,
  SyncingState,
  ProcessingState,
  EmptyState,
  ErrorState,
  NoResultsState,
  TimeoutState,
  CancellableLoader,
  LoadingAlert,
  SkeletonTableRows,
  ButtonLoader,
  CardLoader,
  FullPageLoading,
  LazyLoadIndicator,
  RefreshingIndicator
};
